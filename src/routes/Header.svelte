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
    ChevronDown,
    ChevronUp,
    DropdownDivider,
    DarkMode,
  } from "flowbite-svelte";
  import Auth from "../components/Auth.svelte";
  import { signModalState } from "../stores/store";
  import { page } from '$app/stores';

  let size;
  let store;
  authStore.subscribe((value) => {
    store = value;
  });


  let profileDrop = false;
  let chevDrop = false;

  //   Profile dropdown toggle
  function menuHandler() {
    profileDrop = !profileDrop;
  }

  //   Chevron dropdown toggle
  function chevHandler() {
    chevDrop = !chevDrop;
  }

</script>
<svelte:window bind:innerWidth={size} />
<Navbar let:hidden let:toggle class="border-b-2 divide-y-reverse fixed z-10 bg-slate-200">
  <NavBrand href="/">
    <span class="self-center ml-4 md:ml-0 whitespace-nowrap text-xl font-semibold dark:text-white">
      Memora
    </span>
  </NavBrand>
  {#if size < 768}
    <NavHamburger on:click={menuHandler} class="absolute top-1 right-1 z-20" />
    {#if profileDrop}
      <ul class="absolute text-base w-[35%] top-0 right-0 pt-3 pr-8 pl-2 pb-2 flex flex-col justify-end gap-1 bg-white dark:bg-darkbg rounded-lg">
        <a href="/" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Home</li></a>
        <a href="/notes" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/notes" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Notes</li></a>
        <a href="/tasks" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/tasks" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Tasks</li></a>
        <a href="/textEditor" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/textEditor" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Text Editor</li></a>
        <a href="/calendar" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/calendar" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Calendar</li></a>
        <li id="nav-menu1" class="w-fit mx-2 cursor-pointer text-center flex gap-2" on:click={chevHandler}>
          <div class="h-6 w-6 rounded-full text-black border border-gray-400 flex justify-center items-center dark:text-white">
            {store.currentUser
              ? Array.from(store.currentUser.email)[0].toUpperCase()
              : "U"}
          </div>
          {#if chevDrop}
            <i class="bi bi-chevron-up"></i>
          {:else}
            <i class="bi bi-chevron-down"></i>
          {/if}
        </li>
        {#if chevDrop}
          <a href="/privatedashboard" on:click={() => {profileDrop = false}}><li class={`w-fit mx-2 ${$page.url.pathname === "/privatedashboard" ? "text-blue-700 font-semibold" : ""} dark:text-white`}>Private Dash</li></a>
          <li class={`w-fit mx-2 text-gray-400`}>Settings</li>
          <li class={`w-fit mx-2 text-gray-400`}>Earnings</li>
        {/if}
        <li class="flex justify-end w-fit h-fit pt-1" on:click={() => {profileDrop = false}}><DarkMode/></li>
        <!-- <li href="/privatedashboard" active={$page.url.pathname === '/privatedashboard' ? true : false}>Private Dashboard</li> -->
      </ul>
    {/if}
  {:else}
    <NavUl {hidden} class="flex items-center justify-center gap-2">
      <NavLi href="/" active={$page.url.pathname === "/" ? true : false}>Home</NavLi>
      <NavLi href="/notes"  active={$page.url.pathname === "/notes" ? true : false}>Notes</NavLi>
      <NavLi href="/tasks" active={$page.url.pathname === '/tasks' ? true : false}>Tasks</NavLi>
      <NavLi href="/textEditor" active={$page.url.pathname === '/textEditor' ? true : false}>Text Editor</NavLi>
      <NavLi href="/calendar" active={$page.url.pathname === '/calendar' ? true : false}>Calendar</NavLi>
      <NavLi id="nav-menu1" class="cursor-pointer">
        <Chevron aligned>
          <div class="h-8 w-8 rounded-full text-black border border-gray-400 flex justify-center items-center dark:text-white">
            {store.currentUser
              ? Array.from(store.currentUser.email)[0].toUpperCase()
              : "U"}
          </div>
        </Chevron>
      </NavLi>
      <DarkMode />
      <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
        <DropdownItem>
          <NavLi href="/privatedashboard" active={$page.url.pathname === '/privatedashboard' ? true : false}>
            Private Dashboard
          </NavLi>
        </DropdownItem>
        <DropdownItem class="text-gray-400 pointer-events-none">Settings</DropdownItem>
        <DropdownItem class="text-gray-400 pointer-events-none">Earnings</DropdownItem>
        <DropdownDivider/>
        <DropdownItem
          on:click={store.currentUser
            ? authHandlers.logout
            : signModalState.set(true)}
        >
        {store.currentUser ? "Sign out" : "Log In"}
        </DropdownItem>
      </Dropdown>
    </NavUl>
  {/if}
</Navbar>

<style>
/* unvisited link */
a:link {
  color: black;
}

/* visited link */
a:visited {
  color: black;
}

/* selected link */
a:active {
  color: blue;
}
</style>