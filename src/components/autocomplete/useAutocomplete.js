import React, { useRef, useState } from "react";

const KEY_CODES = {
  DOWN: 40,
  UP: 38,
  PAGE_DOWN: 34,
  ESCAPE: 27,
  PAGE_UP: 33,
  ENTER: 13,
};

export default function useAutoComplete({ delay = 500, source, onChange, isSearchOnFocus=false }) {
  const [myTimeout, setMyTimeOut] = useState(setTimeout(() => {}, 0));
  const listRef = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [isBusy, setBusy] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [textValue, setTextValue] = useState("");

  const delayInvoke = (cb) => {
    if (myTimeout) {
      clearTimeout(myTimeout);
    }
    setMyTimeOut(setTimeout(cb, delay));
  };

  const selectOption = (index) => {
    if (index > -1) {
      onChange(suggestions[index]);
      setTextValue(suggestions[index].label);
    }
    clearSuggestions();
  };

  const getSuggestions = async (searchTerm) => {
    if (searchTerm && source) {
      const options = await source(searchTerm);
      setSuggestions(options);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const onTextChange = (searchTerm) => {
    setBusy(true);
    setTextValue(searchTerm);
    clearSuggestions();
    delayInvoke(() => {
      getSuggestions(searchTerm);
      setBusy(false);
    });
  };

  const optionHeight = listRef.current?.children[0]?.clientHeight;

  const scrollUp = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    listRef.current.scrollTop -= optionHeight;
  };

  const scrollDown = () => {
    if (selectedIndex < suggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    listRef.current.scrollTop = selectedIndex * optionHeight;
  };

  const pageDown = () => {
    setSelectedIndex(suggestions.length - 1);
    listRef.current.scrollTop = suggestions.length * optionHeight;
  };

  const pageUp = () => {
    setSelectedIndex(0);
    listRef.current.scrollTop = 0;
  };

  const onKeyDown = (e) => {
    const keyOperation = {
      [KEY_CODES.DOWN]: scrollDown,
      [KEY_CODES.UP]: scrollUp,
      [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
      [KEY_CODES.ESCAPE]: clearSuggestions,
      [KEY_CODES.PAGE_DOWN]: pageDown,
      [KEY_CODES.PAGE_UP]: pageUp,
    };
    if (keyOperation[e.keyCode]) {
      keyOperation[e.keyCode]();
    } else {
      setSelectedIndex(-1);
    }
  };

  const onBlur = () => {
    isSearchOnFocus && clearSuggestions();
  };

  return {
    bindOption: {
      onMouseDown: (e) => {
        let nodes = Array.from(listRef.current.children);
        selectOption(nodes.indexOf(e.target.closest("li")));
      },
    },
    bindInput: {
      value: textValue,
      onChange: (e) => onTextChange(e.target.value),
      onKeyDown,
      onBlur,
    },
    bindOptions: {
      ref: listRef,
    },
    isBusy,
    suggestions,
    selectedIndex,
  };
}
