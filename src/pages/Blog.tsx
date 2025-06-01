import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { LazyImage } from "@/components/LazyImage";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React",
    excerpt: "Learn the basics of React and how to build your first application.",
    date: "2024-03-15",
    image: "/blog/react.jpg",
    slug: "getting-started-with-react",
  },
  // Add more blog posts here
];

export default function Blog() {
  const { t } = useTranslation();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-8">{t("blog.title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <LazyImage
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <time className="text-sm text-muted-foreground">{post.date}</time>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
} 