import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible component for creating expandable/collapsible sections
 * Built on top of Radix UI's Collapsible primitive
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * CollapsibleTrigger component for toggling the collapsible section
 * Built on top of Radix UI's CollapsibleTrigger primitive
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * CollapsibleContent component for the content of the collapsible section
 * Built on top of Radix UI's CollapsibleContent primitive
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
