// One page-scroll lock shared by every overlay (menu, previews, resume). Each overlay locks on
// open and unlocks on close; the page scrolls again only when the last one has closed, so two
// overlapping overlays can never leave it stuck.
let holders = 0;

export function lockScroll() {
  holders += 1;
  document.body.style.overflow = "hidden";
  return () => {
    holders = Math.max(0, holders - 1);
    if (holders === 0) document.body.style.overflow = "";
  };
}
