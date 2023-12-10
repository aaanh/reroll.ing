package main

import (
	"os"
	"database/sql"
	"fmt"
	"time"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	os.Setenv("CGO_ENABLED", "1")
	db, err := sql.Open("sqlite3", "./sv.db")
	checkErr(err)
}
