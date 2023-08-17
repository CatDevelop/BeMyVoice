import {createGlobalStyle} from 'styled-components';
import {standard} from '@salutejs/plasma-typo';
import {dark} from '@salutejs/plasma-tokens-web/themes';

import {
    text, // Цвет текста
    background, // Цвет подложки
    gradient, // Градиент
} from '@salutejs/plasma-tokens-web';

const DocumentStyle = createGlobalStyle`    html {
  color: ${text};
  background-color: ${background};
  background-image: ${gradient};
}`;

const ThemeStyle = createGlobalStyle(dark);
const TypoStyle = createGlobalStyle(standard);
export const GlobalStyle = () => (
    <>
        <DocumentStyle/>
        <ThemeStyle/>
        <TypoStyle/>
    </>
);
