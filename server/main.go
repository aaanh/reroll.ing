package main

import (
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
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

func doSingleRoll(c *gin.Context) {
	roll := rand.Intn(100) + 1
	// create json object
	body := map[string]int{"roll": roll}
	c.JSON(http.StatusOK, body)
}

func main() {
	router := gin.Default()
	router.GET("/roll/single", doSingleRoll)

	router.Run(":8080")
}
