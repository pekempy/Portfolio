#!/usr/bin/python3
import os
import json
import re
import argparse
from datetime import datetime

# Configure base paths relative to the script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(ROOT_DIR, 'data')
UPLOADS_DIR = os.path.join(ROOT_DIR, 'public', 'uploads')
VERSIONS_DIR = os.path.join(DATA_DIR, 'versions')

def get_referenced_files():
    referenced = set()
    
    # Files to check
    files_to_check = [
        os.path.join(DATA_DIR, 'content.json'),
        os.path.join(DATA_DIR, 'content.staged.json')
    ]
    
    # Add versions
    if os.path.exists(VERSIONS_DIR):
        for f in os.listdir(VERSIONS_DIR):
            if f.endswith('.json'):
                files_to_check.append(os.path.join(VERSIONS_DIR, f))
                
    for file_path in files_to_check:
        if not os.path.exists(file_path):
            continue
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Find all things that look like /uploads/filename.ext
                matches = re.findall(r'/uploads/([^"\'\s>]+)', content)
                for m in matches:
                    referenced.add(m)
        except Exception as e:
            print(f"[{datetime.now()}] Error reading {file_path}: {e}")
            
    return referenced

def main():
    parser = argparse.ArgumentParser(description='Cleanup unused uploads.')
    parser.add_argument('--delete', action='store_true', help='Actually delete the files (otherwise dry-run)')
    args = parser.parse_args()

    if not os.path.exists(UPLOADS_DIR):
        print(f"[{datetime.now()}] Uploads directory {UPLOADS_DIR} does not exist.")
        return

    referenced = get_referenced_files()
    all_uploads = os.listdir(UPLOADS_DIR)
    unused = [f for f in all_uploads if f not in referenced]
    
    print(f"[{datetime.now()}] --- Run Summary ---")
    print(f"Total uploads in folder: {len(all_uploads)}")
    print(f"Unique referenced files: {len(referenced)}")
    print(f"Unused files found: {len(unused)}")
    
    if not unused:
        print("No cleanup necessary.")
        return

    total_size = sum(os.path.getsize(os.path.join(UPLOADS_DIR, f)) for f in unused)
    
    if args.delete:
        print(f"Deleting {len(unused)} files ({total_size / (1024*1024):.2f} MB)...")
        for f in unused:
            try:
                os.remove(os.path.join(UPLOADS_DIR, f))
                print(f"  Removed: {f}")
            except Exception as e:
                print(f"  Failed to remove {f}: {e}")
        print("Cleanup complete.")
    else:
        print(f"DRY RUN: Would delete {len(unused)} files ({total_size / (1024*1024):.2f} MB).")
        print("Run with --delete to perform actual cleanup.")

if __name__ == '__main__':
    main()
