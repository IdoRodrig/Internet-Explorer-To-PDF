import os
import img2pdf
import subprocess

# Execute JavaScript script using TrifleJS
def execute_script(script_path, input_folder):
    triflejs_path = "triflejs.exe"  # Replace with actual path to TrifleJS executable
    command = [triflejs_path, script_path, input_folder]
    subprocess.run(command, shell=True)

# Convert PNG files to PDF using ImageMagick
def convert_to_pdf(input_folder):
    output_folder = os.path.join(input_folder.replace("input", "output"))
    for file in os.listdir(output_folder):
        if file.endswith(".png"):
            png_path = os.path.join(output_folder, file)
            pdf_path = os.path.join(output_folder, file.replace(".png", ".pdf"))
         
            with open(pdf_path, "wb") as pdf_file, open(png_path, "rb") as png_file:
                pdf_file.write(img2pdf.convert(png_file))
            os.remove(png_path)
    
def main():
    script_path = "HTML-to-PNG.js"  # Replace with actual path to your JavaScript script
    current_directory = os.getcwd()
    input_folder = os.path.join(current_directory, "input") # Replace with the input folder containing HTML files
    execute_script(script_path, input_folder)
    convert_to_pdf(input_folder)

if __name__ == "__main__":
    main()
