mod database;
use database::database::connect_to_database;

fn main() {
    connect_to_database().unwrap();
}
