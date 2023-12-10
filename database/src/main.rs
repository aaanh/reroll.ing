use std::fs::File;
use std::io::{self, Read};

fn read_file_content(file_path: &str) -> io::Result<String> {
    // Open the file
    let mut file = File::open(file_path)?;

    // Read the content of the file into a String
    let mut content = String::new();
    file.read_to_string(&mut content)?;

    Ok(content)
}

fn main() {
    let file_path = "./fgo-servants-basic.json";
    match read_file_content(file_path) {
        Ok(content) => {
            println!("{}", content)
        }
        Err(err) => {
            eprintln!("Error reading file: {}", err);
        }
    }
}
