import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: "#3d84f7",
      },
    },
    //   Appling background color on entire body of application
    styles: {
      global: () => ({
        body: {
          bg: "whiteAlpha.200",
        },
      }),
    },
  }
);
