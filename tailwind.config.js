import withMT from "@material-tailwind/react/utils/withMT";
import scrollbarHide from "tailwind-scrollbar-hide";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-brown': '#896447', // Nombre de color personalizado
      },
    },
  },
  plugins: [scrollbarHide],
});
