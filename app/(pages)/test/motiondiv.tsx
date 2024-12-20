import { motion } from "framer-motion";

export default function MotionDiv() {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "#45a049",
      }}
      whileTap={{
        backgroundColor: "#45a049",
      }}
      transition={{ duration: 0.3 }}
    >
      Quesa
    </motion.div>
  );
}
