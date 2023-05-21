<script>
  import {
    Textarea,
    Toolbar,
    ToolbarGroup,
    ToolbarButton,
    Button,
    Label,
    Input,
  } from "flowbite-svelte";
  import { afterUpdate } from "svelte";
  import "bootstrap-icons/font/bootstrap-icons.css";

  let document = "";
  let docRef;
  let currSelection = {};
  let formattedDocument = "";
  let mods = [];

  // function handleMouseUp() {
  //   const selection = window.getSelection();
  //   if (selection && selection.toString().length > 0) {
  //     console.log("RANGE", selection.getRangeAt(0).extractContents());
  //     const start = selection.anchorOffset;
  //     const end = selection.focusOffset;
  //     currSelection = selection;
  //     mods.push({
  //       selection: selection.toString(),
  //       start,
  //       end,
  //     });
  //     console.log("docRef.innerHTML", docRef.innerHTML);
  //     console.log("document", document);
  //     console.log("mods", mods);
  //   }
  //   console.log("selection", selection);
  // }
  function handleMouseUp(event) {
    let start = event.target.selectionStart;
    let end = event.target.selectionEnd;
    let selection = event.target.value.substring(start, end);
    if (selection.length > 0) {
      mods.push({
        selection,
        start,
        end,
      });
      currSelection = { selection, start, end };
    }
    console.log(mods);
    console.log(document, document.innerHTML);
  }

  function handleBold() {
    if (currSelection) {
      let bolded = `<strong>${currSelection.selection}</strong>`;
      document =
        document.slice(0, currSelection.start) +
        bolded +
        document.slice(currSelection.end);
      formattedDocument = document;
    }
    console.log(formattedDocument);
  }

  afterUpdate(() => {
    formattedDocument = document;
  });
</script>

<form>
  <label for="editor" class="sr-only">Publish post</label>
  <Textarea
    id="editor"
    rows="8"
    class="mb-4"
    placeholder="Your Text Here..."
    bind:value={document}
    bind:this={docRef}
    on:click={handleMouseUp}
  >
    <div>
      {@html formattedDocument}
    </div>
    <Toolbar slot="header" embedded>
      <ToolbarGroup>
        <ToolbarButton name="Attach file" on:click={handleBold}
          ><i class="bi bi-type-bold text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-type-italic text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-type-underline text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-list-ul text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-list-ol text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-link text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-left text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-center text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-right text-2xl" /></ToolbarButton
        >
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarButton name="Add emoji"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            /></svg
          ></ToolbarButton
        >
      </ToolbarGroup>
    </Toolbar>
  </Textarea>
</form>

<form>
  <label for="editor" class="sr-only">Publish post</label>
  <Textarea
    id="editor"
    rows="8"
    class="mb-4"
    placeholder="Write a comment"
    bind:value={document}
    bind:this={docRef}
    on:click={handleMouseUp}
  >
    <Toolbar slot="header" embedded>
      <ToolbarGroup>
        <ToolbarButton name="Attach file" on:click={handleBold}
          ><i class="bi bi-type-bold text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-type-italic text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-type-underline text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-list-ul text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-list-ol text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-link text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-left text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-center text-2xl" /></ToolbarButton
        >
        <ToolbarButton name="Attach file"
          ><i class="bi bi-text-right text-2xl" /></ToolbarButton
        >
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarButton name="Add emoji"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            /></svg
          ></ToolbarButton
        >
      </ToolbarGroup>
    </Toolbar>
  </Textarea>
  <div contenteditable="true">
    {@html formattedDocument}
  </div>
  <Label class="block space-y-2">
    <Input
      label="Email"
      id="email"
      required
      placeholder="Write your text here..."
      bind:value={document}
      bind:this={docRef}
      on:click={handleMouseUp}>{@html formattedDocument}</Input
    >
  </Label>
</form>
