import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Maximum number of toasts allowed
const TOAST_LIMIT = 1
// Delay before removing a toast (in milliseconds)
const TOAST_REMOVE_DELAY = 1000

/**
 * Extended toast type that includes internal properties
 * Features:
 * - Unique identifier for each toast
 * - Support for React nodes in title and description
 * - Optional action element
 * - Open state for visibility control
 */
interface ToasterToast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'destructive'
  duration?: number
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
}

/**
 * Action types for toast state management
 * Features:
 * - ADD_TOAST: Add a new toast
 * - UPDATE_TOAST: Update an existing toast
 * - DISMISS_TOAST: Dismiss a toast (with optional ID)
 * - REMOVE_TOAST: Remove a toast from the state
 */
type ToastActionType =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: string
    }

/**
 * State interface for toast management
 * Features:
 * - Array of active toasts
 * - Maintains toast order
 */
interface State {
  toasts: ToasterToast[]
}

// Initial state for toast management
const initialState: State = {
  toasts: [],
}

// Map to store timeouts for toast removal
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Add a toast to the removal queue
 * Features:
 * - Prevents duplicate timeouts
 * - Automatically removes toast after delay
 * - Cleans up timeout references
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer function for toast state management
 * Features:
 * - Handles all toast actions
 * - Maintains toast limit
 * - Manages toast lifecycle
 */
export const reducer = (state: State, action: ToastActionType): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Dismiss all toasts if no ID provided
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Dismiss specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Listeners for toast state changes
const listeners: Array<(state: State) => void> = []

// Current toast state
let memoryState: State = initialState

/**
 * Dispatch function for toast actions
 * Features:
 * - Updates state
 * - Notifies listeners
 * - Maintains state consistency
 */
function dispatch(action: ToastActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Toast creation function
 * Features:
 * - Generates unique ID
 * - Handles updates and dismissal
 * - Manages toast lifecycle
 */
type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = Math.random().toString(36).substring(2, 9)

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook for using toast functionality
 * Features:
 * - Manages toast state
 * - Provides toast creation and dismissal
 * - Handles cleanup on unmount
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
