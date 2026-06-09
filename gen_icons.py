import os, shutil

# Copy icon dari folder icons/ (yang sudah di-commit ke repo)
# ke folder Android res setelah cap sync
base_res = 'android/app/src/main/res'

sizes = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi']

for folder in sizes:
    src_dir = f'icons/{folder}'
    dst_dir = f'{base_res}/{folder}'

    if not os.path.exists(src_dir):
        print(f"Source not found: {src_dir}, skipping")
        continue

    os.makedirs(dst_dir, exist_ok=True)

    for fname in ['ic_launcher.png', 'ic_launcher_round.png']:
        src = f'{src_dir}/{fname}'
        dst = f'{dst_dir}/{fname}'
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {src} → {dst}")

# Hapus adaptive icon folder — ini yang selalu override icon kita
adaptive_path = f'{base_res}/mipmap-anydpi-v26'
if os.path.exists(adaptive_path):
    shutil.rmtree(adaptive_path)
    print(f"Removed {adaptive_path} (prevents adaptive icon override)")

print("Icon override complete!")
