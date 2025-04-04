import * as Dialog from "@radix-ui/react-dialog";
// import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Or your utility component

function YourDialogComponent() {
  // ... component logic ...

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{/* Your trigger element */}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          {/* Add this DialogTitle */}
          <Dialog.Title>Edit Model Details</Dialog.Title>
          {/* Or hide it visually */}
          {/* <VisuallyHidden asChild>
              <Dialog.Title>Edit Model Details</Dialog.Title>
          </VisuallyHidden> */}

          {/* ... rest of your dialog content ... */}

          <Dialog.Description>
            {/* Optional: Add a description */}
          </Dialog.Description>
          <Dialog.Close asChild>{/* Your close button */}</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
