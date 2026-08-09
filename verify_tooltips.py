import os
import sys
import time
import subprocess
from playwright.sync_api import sync_playwright

def run_verification():
    print("Starting local HTTP server...")
    # Kill any existing server on 8080
    try:
        subprocess.run("kill $(lsof -t -i :8080) 2>/dev/null", shell=True)
    except Exception:
        pass

    server_process = subprocess.Popen(
        ["python3", "-m", "http.server", "8080"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # Wait for server to start
    time.sleep(1.5)

    screenshots_dir = "/home/jules/verification/screenshots"
    videos_dir = "/home/jules/verification/videos"
    os.makedirs(screenshots_dir, exist_ok=True)
    os.makedirs(videos_dir, exist_ok=True)

    success = False
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)

            # Record video
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                record_video_dir=videos_dir
            )
            page = context.new_page()

            print("Navigating to application...")
            page.goto("http://localhost:8080")
            page.wait_for_load_state("networkidle")

            # Take screenshot of Public View
            page.screenshot(path=f"{screenshots_dir}/01_public_view.png")
            print("Switched/rendered public view successfully.")

            # Switch to Research Edition
            print("Switching to Research View...")
            page.click("#tab-research")
            page.wait_for_timeout(500) # Wait for view switch transition
            page.screenshot(path=f"{screenshots_dir}/02_research_view.png")

            # Find a tooltip trigger
            # Triggers are elements with data-tip in research view, specifically .kf-num
            trigger = page.locator(".kf-num[data-tip]").first
            trigger_text = trigger.inner_text()
            print(f"Found tooltip trigger with value: {trigger_text}")

            # Scroll trigger into view if needed
            trigger.scroll_into_view_if_needed()
            page.wait_for_timeout(200)

            # Hover over trigger to show tooltip
            print("Hovering over trigger element...")
            box = trigger.bounding_box()
            if box:
                # Hover slightly above center
                page.mouse.move(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            else:
                trigger.hover()

            # Wait for any DOM/layout updates
            page.wait_for_timeout(200)
            page.screenshot(path=f"{screenshots_dir}/03_tooltip_hover.png")

            # Assert tooltip is visible (has the class 'show' and is in DOM)
            tooltip = page.locator("#globalTip")
            is_visible = tooltip.is_visible()
            has_show_class = "show" in (tooltip.get_attribute("class") or "")

            print(f"Tooltip is_visible: {is_visible}, has 'show' class: {has_show_class}")

            if not is_visible or not has_show_class:
                raise Exception("Tooltip did not show up on hover!")

            # Get current tooltip style to verify transform-based position
            style_before = tooltip.get_attribute("style") or ""
            print(f"Tooltip style on first hover: {style_before}")
            if "transform" not in style_before or "translate3d" not in style_before:
                raise Exception("Tooltip is not using transform: translate3d for GPU rendering!")

            # Move mouse slightly to verify smooth tracking via requestAnimationFrame
            print("Moving mouse to verify smooth tracking...")
            if box:
                page.mouse.move(box["x"] + box["width"]/2 + 30, box["y"] + box["height"]/2 + 10)
            page.wait_for_timeout(200)

            style_after = tooltip.get_attribute("style") or ""
            print(f"Tooltip style after mouse move: {style_after}")
            if style_before == style_after:
                raise Exception("Tooltip style didn't update during mouse move!")

            page.screenshot(path=f"{screenshots_dir}/04_tooltip_tracked.png")

            # Move mouse far away to trigger hide
            print("Moving mouse away to verify hiding...")
            page.mouse.move(10, 10)

            # Assert that within 120ms it starts to hide (or is fully hidden / opacity transition)
            page.wait_for_timeout(300) # Wait past 120ms hideTimer
            has_show_class_after = "show" in (tooltip.get_attribute("class") or "")
            print(f"Tooltip has 'show' class after mouseout: {has_show_class_after}")

            if has_show_class_after:
                raise Exception("Tooltip did not hide after mouseout!")

            page.screenshot(path=f"{screenshots_dir}/05_tooltip_hidden.png")

            context.close()
            browser.close()
            success = True
            print("Tooltip UI verification PASSED successfully!")

    except Exception as e:
        print(f"Verification FAILED with error: {e}", file=sys.stderr)
        success = False
    finally:
        print("Stopping local HTTP server...")
        server_process.terminate()
        server_process.wait()

    if not success:
        sys.exit(1)

if __name__ == "__main__":
    run_verification()
