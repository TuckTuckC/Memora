<script>
  import { authHandlers, authStore } from "../stores/authStore";
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Chevron,
    DropdownDivider,
    DarkMode,
  } from "flowbite-svelte";
  import Auth from "../components/Auth.svelte";
  import { signModalState } from "../stores/store";

  let store;
  authStore.subscribe((value) => {
    store = value;
  });

  let profileDrop = false;

  //   Profile dropdown toggle
  function menuHandler() {
    profileDrop = !profileDrop;
  }
</script>

<Navbar let:hidden let:toggle class="border-b-2 divide-y-reverse">
  <NavBrand href="/">
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      Memora
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/" active={true}>Home</NavLi>
    <NavLi href="/notes">Notes</NavLi>
    <NavLi href="/tasks">Tasks</NavLi>
    <NavLi href="/textEditor">Text Editor</NavLi>
    <NavLi href="/">Calendar</NavLi>
    <NavLi id="nav-menu1" class="cursor-pointer"
      ><Chevron aligned>
        <div
          class="h-8 w-8 rounded-full text-black border border-gray-400 flex justify-center items-center dark:text-white"
        >
          {store.currentUser
            ? Array.from(store.currentUser.email)[0].toUpperCase()
            : "U"}
        </div></Chevron
      ></NavLi
    >
    <DarkMode />
    <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
      <DropdownItem
        ><NavLi href="/privatedashboard">Private Dashboard</NavLi></DropdownItem
      >
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <DropdownDivider />
      <DropdownItem
        on:click={store.currentUser
          ? authHandlers.logout
          : signModalState.set(true)}
        >{store.currentUser ? "Sign out" : "Log In"}</DropdownItem
      >
    </Dropdown>
  </NavUl>
</Navbar>

<style>
  a:hover {
    text-decoration: none;
  }
  /* header {
    display: flex;
    justify-content: space-between;
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-theme-1);
  } */
</style>
