import { getByText, fireEvent, waitForElement } from '@testing-library/react';

const keyDownEvent = {
    key: 'ArrowDown',
};

export async function selectOption(container: HTMLElement, placeHolderText: string, optionText: string) {
    const placeholder = getByText(container, placeHolderText);
    fireEvent.keyDown(placeholder, keyDownEvent);
    await waitForElement(() => getByText(container, optionText));
    fireEvent.click(getByText(container, optionText));
}