import os

def print_tree(root_dir, output_file):
    with open(output_file, "w") as f:
        for root, dirs, files in os.walk(root_dir):
            level = root.replace(root_dir, "").count(os.sep)
            indent = "│   " * level
            f.write(f"{indent}├── {os.path.basename(root)}/\n")
            subindent = "│   " * (level + 1)
            for file in files:
                f.write(f"{subindent}├── {file}\n")

if __name__ == "__main__":
    ROOT_DIRECTORY = "."          # change if needed
    OUTPUT_FILE = "tree.txt"      # output file name
    print_tree(ROOT_DIRECTORY, OUTPUT_FILE)
