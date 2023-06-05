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
    <NavLi href="/calendar">Calendar</NavLi>
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
