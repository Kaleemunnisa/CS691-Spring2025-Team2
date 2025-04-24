import sys
import cv2
import numpy as np

def is_blurry(img, threshold=15.0):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    return laplacian_var < threshold

def calculate_edge_density(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    edged = cv2.Canny(blurred, 20, 80)
    edge_pixels = np.count_nonzero(edged)
    total_pixels = edged.shape[0] * edged.shape[1]
    return edge_pixels / total_pixels

def has_single_dominant_contour(img, min_area_ratio=0.0001):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return False
    largest = max(contours, key=cv2.contourArea)
    return cv2.contourArea(largest) / (img.shape[0] * img.shape[1]) > min_area_ratio

def is_object_centered_and_big(img, center_tol=0.4, min_ratio=0.08):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return False
    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)
    cx, cy = x + w // 2, y + h // 2
    center_x, center_y = img.shape[1] // 2, img.shape[0] // 2
    centered = abs(cx - center_x) < center_x * center_tol and abs(cy - center_y) < center_y * center_tol
    size_ok = (w * h) / (img.shape[0] * img.shape[1]) > min_ratio
    return centered and size_ok

def is_likely_clothing(img):
    if calculate_edge_density(img) < 0.001:
        return False
    if not has_single_dominant_contour(img):
        return False
    if not is_object_centered_and_big(img):
        return False
    return True

def remove_background(img):
    max_dim = 512
    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)))
    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    rect = (10, 10, img.shape[1] - 20, img.shape[0] - 20)
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")
    alpha = mask2 * 255
    b, g, r = cv2.split(img)
    return cv2.merge((b, g, r, alpha))

def enhance_image(img):
    if img.shape[2] == 4:
        bgr, alpha = img[:, :, :3], img[:, :, 3]
    else:
        bgr, alpha = img, None

    # Calculate average brightness
    brightness = np.mean(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY))

    # Adaptive enhancement based on brightness
    if brightness < 100:
        alpha_factor = 1.3
        beta = 25
        sharpen = True
    elif brightness < 180:
        alpha_factor = 1.1
        beta = 10
        sharpen = True
    else:
        alpha_factor = 1.0
        beta = 0
        sharpen = False

    bgr = cv2.convertScaleAbs(bgr, alpha=alpha_factor, beta=beta)

    if sharpen:
        kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        bgr = cv2.filter2D(bgr, -1, kernel)

    return cv2.merge((bgr, alpha)) if alpha is not None else bgr

def add_white_background(rgba_img):
    if rgba_img.shape[2] < 4:
        return rgba_img
    background = np.ones_like(rgba_img) * 255
    alpha_channel = rgba_img[:, :, 3] / 255.0
    for c in range(3):
        background[:, :, c] = background[:, :, c] * (1 - alpha_channel) + rgba_img[:, :, c] * alpha_channel
    return background[:, :, :3].astype(np.uint8)

def preprocess_clothing_image(img):
    if img is None or is_blurry(img) or not is_likely_clothing(img):
        return None
    img_no_bg = remove_background(img)
    enhanced = enhance_image(img_no_bg)
    return add_white_background(enhanced)

def read_image_from_stdin():
    image_data = sys.stdin.buffer.read()
    image_array = np.frombuffer(image_data, dtype=np.uint8)
    return cv2.imdecode(image_array, cv2.IMREAD_UNCHANGED)

if __name__ == '__main__':
    img = read_image_from_stdin()
    processed = preprocess_clothing_image(img)
    if processed is not None:
        success, buffer = cv2.imencode('.png', processed)
        if success:
            sys.stdout.buffer.write(buffer.tobytes())
            sys.exit(0)
    sys.exit(1)
