package main

import (
	"database/sql"
	_ "fmt"
	"math/rand"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

const SSR_RATE = 0.01
const SR_RATE = 0.07
const OTHER_RATE = 0.2

// Return list of Servants in JSON format
type Servant struct {
	CollectionNo int    `json:"collectionNo"`
	Name         string `json:"name"`
	ClassName    string `json:"className"`
	Rarity       int    `json:"rarity"`
	Face         string `json:"face"`
}

// func getServant(c *gin.Context) {
// 	rarity := c.Query("rarity")
// }

func doSingleRoll(servants []Servant) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		roll := rand.Intn(400) + 1
		body := map[string]Servant{"roll": servants[roll]}
		c.JSON(http.StatusOK, body)
	}

	return gin.HandlerFunc(fn)
}

func main() {
	db, _ := sql.Open("sqlite3", "../database/sv_db.db")
	defer db.Close()
	rows, _ := db.Query("SELECT * FROM servants")
	defer rows.Close()

	var servants []Servant

	for rows.Next() {
		var servant Servant
		rows.Scan(&servant.CollectionNo, &servant.Name, &servant.Rarity, &servant.ClassName, &servant.Face)
		servants = append(servants, servant)
	}

	router := gin.Default()

	// CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	router.Use(cors.New(config))

	router.GET("/roll/single", doSingleRoll(servants))

	router.Run(":8080")
}
