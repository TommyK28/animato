import "../scss/main.scss";

console.log("Hello Animato!");

// Hamburger menu toggle for mobile display (header component)
const toggle = document.querySelector(".js-nav-toggle");
const nav = document.getElementById("header-nav");
const body = document.body;
const mq = matchMedia("(min-width: 960px)");
const header = document.querySelector(".header");
const focusableElements =
    'h1,a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

let abortController;

function getFocusableElements() {
    return [...header.querySelectorAll(focusableElements)];
}

function trapFocus(active) {
    abortController?.abort();
    if (!active || mq.matches) return;

    const ctrl = new AbortController();
    abortController = ctrl;

    document.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Escape") return setNav(false);
            if (e.key !== "Tab") return;

            const f = getFocusableElements();
            if (!f.length) return;
            const [first, last] = [f[0], f[f.length - 1]];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        },
        { capture: true, signal: ctrl.signal }
    );
}

function setNav(open) {
    toggle.setAttribute("aria-expanded", open);
    nav.classList.toggle("header__nav--active", open);
    nav.toggleAttribute("inert", !open);
    nav.setAttribute("aria-hidden", !open);
    body.classList.toggle("body--lock", open && !mq.matches);

    if (!mq.matches) {
        if (open) {
            (getFocusableElements()[0] || nav).focus();
        } else {
            toggle.focus();
        }
    }

    trapFocus(open);
}

toggle.addEventListener("click", () =>
    setNav(toggle.getAttribute("aria-expanded") !== "true")
);

// Universal accordion function for entire pages
(() => {
    function initAccordion(options) {
        const {
            container,
            itemSelector,
            triggerSelector,
            panelSelector,
            openClass,
            closeSiblings,
            onlyWhen,
        } = options;
        const root =
            typeof container === "string"
                ? document.querySelector(container)
                : container;
        if (!root) return;

        const genId = (() => {
            let i = 0;
            return (prefix = "acc") =>
                `${prefix}-${Math.random().toString(36).slice(2, 7)}-${i++}`;
        })();

        function setAria(trigger, panel, expanded) {
            if (!panel.id) panel.id = genId("panel");
            trigger.setAttribute("aria-controls", panel.id);
            trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
            panel.setAttribute("aria-hidden", expanded ? "false" : "true");
        }

        root.addEventListener("click", (e) => {
            const trigger = e.target.closest(triggerSelector);
            if (!trigger || !root.contains(trigger)) return;

            if (onlyWhen && !onlyWhen()) return;

            if (trigger.tagName === "A" || trigger.tagName === "BUTTON") {
                e.preventDefault();
            }

            const item = trigger.closest(itemSelector);
            if (!item) return;

            const panel = item.querySelector(panelSelector);
            if (!panel) return;

            const isOpen = item.classList.contains(openClass);

            if (isOpen) {
                item.classList.remove(openClass);
                setAria(trigger, panel, false);
            } else {
                if (closeSiblings) {
                    item.parentElement
                        .querySelectorAll(`${itemSelector}.${openClass}`)
                        .forEach((sibling) => {
                            if (sibling !== item) {
                                sibling.classList.remove(openClass);
                                const siblingTrigger =
                                    sibling.querySelector(triggerSelector);
                                const siblingPanel =
                                    sibling.querySelector(panelSelector);
                                if (siblingTrigger && siblingPanel) {
                                    setAria(
                                        siblingTrigger,
                                        siblingPanel,
                                        false
                                    );
                                }
                            }
                        });
                }
                item.classList.add(openClass);
                setAria(trigger, panel, true);
            }
        });

        root.querySelectorAll(itemSelector).forEach((item) => {
            const trigger = item.querySelector(triggerSelector);
            const panel = item.querySelector(panelSelector);
            if (trigger && panel) {
                setAria(trigger, panel, item.classList.contains(openClass));
            }
        });
    }

    // Calling accordion functions
    // 1) Mobile menu (submenu) – only on mobile devices
    const mql = window.matchMedia("(max-width: 767px)");
    initAccordion({
        container: "#header-nav",
        itemSelector: ".header__item--has-submenu",
        triggerSelector: ".header__link",
        panelSelector: ":scope > .header__submenu",
        openClass: "header__item--is-open",
        closeSiblings: true,
        onlyWhen: () => mql.matches,
    });

    // 2)  Accordion for FAQs – multiple open at once
    initAccordion({
        container: ".faq__list",
        itemSelector: ".faq__item",
        triggerSelector: ".faq__question-button",
        panelSelector: ":scope > .faq__answer",
        openClass: "faq__item--open",
        closeSiblings: false,
    });
})();
