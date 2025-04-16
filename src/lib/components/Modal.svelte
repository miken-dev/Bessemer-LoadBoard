<script>
  import { fade, fly } from 'svelte/transition';
  import { trapFocus } from '../../trapfocus'; // https://zachpatrick.com/blog/how-to-trap-focus-inside-modal-to-make-it-ada-compliant
 
  /* trap all keyboard navigation inside the modal */
  function initTrapFocus(e) {
    return trapFocus(e, `modal`);
  }

  /* close the modal when the escape button is pressed */
  function closeWithEscape(e) {
    if (e.keyCode === 27) {
      isOpen = false;
    }
  }

  export let isOpen = false;
</script>

<!-- add keyboard event listeners to window while modal is open -->
<svelte:window on:keydown={initTrapFocus} on:keyup={closeWithEscape} />

<div
  role="dialog"
  id="modal"
  class="fixed inset-0 z-50 flex items-start justify-center overflow-auto overscroll-contain"
  class:window-noscroll={isOpen}
>
  <div
    id="modal-overlay"
    class="fixed inset-0 z-10 bg-black/50"
    aria-hidden="true"
    on:click={() => (isOpen = false)}
    transition:fade={{ duration: 100 }}
  ></div>

  <div class="relative z-20" transition:fly={{ y: -60, duration: 250 }}>
    <slot />
  </div>
</div>

<style>
  :global(html:has(.window-noscroll), html:has(.window-noscroll) body) {
    overflow: hidden;
  }

  :global(header.site-header),
  :global(#main) {
    transition: filter 500ms;
  }

  :global(html:has(.window-noscroll) header.site-header),
  :global(html:has(.window-noscroll) #main) {
    filter: blur(5px);
  }
</style>
