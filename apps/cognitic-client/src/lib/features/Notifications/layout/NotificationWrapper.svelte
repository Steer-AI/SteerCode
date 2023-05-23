<script lang="ts">
  import { Position } from '$lib/models/enums/notifications';
  import { notificationStore } from '../store/notifications';
  import Notification from './Notification.svelte';
</script>

<div class="notifications">
  {#each Object.values(Position) as position}
    <div class="position-style-{position}">
      {#each $notificationStore as notification (notification.id)}
        {#if notification.position === position}
          <Notification {notification} />
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .notifications .position-style-top-left,
  .notifications .position-style-top-center,
  .notifications .position-style-top-right,
  .notifications .position-style-bottom-left,
  .notifications .position-style-bottom-center,
  .notifications .position-style-bottom-right {
    position: fixed;
    max-width: 400px;
    z-index: 1000;
  }
  .notifications .position-style-top-left {
    top: 60px;
    left: 60px;
  }
  .notifications .position-style-top-center {
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
  }
  .notifications .position-style-top-right {
    top: 60px;
    right: 60px;
  }
  .notifications .position-style-bottom-left {
    bottom: 60px;
    left: 60px;
  }
  .notifications .position-style-bottom-center {
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
  }
  .notifications .position-style-bottom-right {
    bottom: 60px;
    right: 60px;
  }
</style>
