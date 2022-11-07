import data from "@emoji-mart/data";
import FuzzySearch from "fuzzy-search";
import { snakeCase } from "lodash";
import React from "react";
import CommandMenu, { Props } from "./CommandMenu";
import EmojiMenuItem from "./EmojiMenuItem";

type Emoji = {
  name: string;
  title: string;
  emoji: string;
  description: string;
  attrs: { markup: string; "data-name": string };
};

const searcher = new FuzzySearch<typeof data.emojis["100"]>(
  Object.values(data.emojis),
  ["keywords"],
  {
    caseSensitive: true,
    sort: true,
  }
);

class EmojiMenu extends React.PureComponent<
  Omit<
    Props<Emoji>,
    | "renderMenuItem"
    | "items"
    | "onLinkToolbarOpen"
    | "embeds"
    | "onClearSearch"
  >
> {
  get items(): Emoji[] {
    const { search = "" } = this.props;

    const n = search.toLowerCase();
    const result = searcher.search(n).map((item) => {
      // We snake_case the shortcode for backwards compatability with gemoji to
      // avoid multiple formats being written into documents.
      const shortcode = snakeCase(item.id);
      const emoji = item.skins[0].native;

      return {
        name: "emoji",
        title: emoji,
        description: item.name,
        emoji,
        attrs: { markup: shortcode, "data-name": shortcode },
      };
    });

    return result.slice(0, 10);
  }

  clearSearch = () => {
    const { state, dispatch } = this.props.view;

    // clear search input
    dispatch(
      state.tr.insertText(
        "",
        state.selection.$from.pos - (this.props.search ?? "").length - 1,
        state.selection.to
      )
    );
  };

  render() {
    const containerId = "emoji-menu-container";
    return (
      <CommandMenu
        {...this.props}
        id={containerId}
        filterable={false}
        onClearSearch={this.clearSearch}
        renderMenuItem={(item, _index, options) => (
          <EmojiMenuItem
            onClick={options.onClick}
            selected={options.selected}
            title={item.description}
            emoji={item.emoji}
            containerId={containerId}
          />
        )}
        items={this.items}
      />
    );
  }
}

export default EmojiMenu;
