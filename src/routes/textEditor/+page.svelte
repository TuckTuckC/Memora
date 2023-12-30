<script>
  import "bootstrap-icons/font/bootstrap-icons.css";

  // TIPTAP
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Underline from "@tiptap/extension-underline";
  import BulletList from "@tiptap/extension-bullet-list";
  import ListItem from "@tiptap/extension-list-item";
  import Paragraph from "@tiptap/extension-paragraph";

  let element;
  let editor;

  const CustomListItem = ListItem.extend({
    renderHTML(props) {
      const { node } = props;
      if (node.firstChild?.type?.name === "paragraph") {
        node.firstChild.attrs = {
          ...node.firstChild.attrs,
          withoutHTMLTag: true,
        };
      }
      return this.parent?.(props);
    },
  });

  const CustomParagraph = Paragraph.extend({
    renderHTML({ node }) {
      return [node?.attrs?.withoutHTMLTag ? "" : "p", 0];
    },
  });

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Paragraph,
        Underline,
        ListItem,
        BulletList.configure({ itemListType: "CustomListItem" }),
      ],
      content: "",
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none h-80 p-4 [&>ul]:list-disc [&>ul]:list-inside",
        },
      },
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<form>
  <div
    class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
  >
    {#if editor}
      <div
        class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600"
      >
        <div class="flex items-center space-x-1 sm:pr-4">
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-type-bold text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleItalic().run()}
            class:active={editor.isActive("italic")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-type-italic text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleUnderline().run()}
            class:active={editor.isActive("underline")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-type-underline text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBulletList().run()}
            class:active={editor.isActive("bulletList")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-list-ul text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-list-ol text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-link text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-text-left text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-text-center text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class:active={editor.isActive("bold")}
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <i class="bi bi-text-right text-lg md:text-2xl" />
            <span class="sr-only">Bold</span>
          </button>
        </div>
        <div class="flex flex-wrap items-center space-x-1 sm:pl-4">
          <button
            type="button"
            class="p-1 md:p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              /></svg
            >
            <span class="sr-only">Add list</span>
          </button>
        </div>
      </div>
    {/if}
    <div
      class="inputField block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
      bind:this={element}
    />
  </div>
</form>

<style>
  .ProseMirror ul > li > p:first-child {
    display: inline !important;
  }
  button.active {
    background: black;
    color: white;
  }
</style>
