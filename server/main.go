package main

import (
	"database/sql"
	_ "fmt"
	"math/rand"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gofor-little/env"
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

func doSingleRoll(servants []Servant) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		roll := rand.Intn(100) + 1

		if roll == 1 {
			var filtered []Servant

			for _, sv := range servants {
				if sv.Rarity == 5 {
					filtered = append(filtered, sv)
				}
			}

			local_roll := rand.Intn(len(filtered))
			body := map[string]Servant{"roll": filtered[local_roll]}
			c.JSON(http.StatusOK, body)
		} else if roll > 1 && roll <= 4 {
			var filtered []Servant

			for _, sv := range servants {
				if sv.Rarity == 4 {
					filtered = append(filtered, sv)
				}
			}

			local_roll := rand.Intn(len(filtered))
			body := map[string]Servant{"roll": filtered[local_roll]}
			c.JSON(http.StatusOK, body)
		} else {
			var filtered []Servant

			for _, sv := range servants {
				if sv.Rarity <= 3 {
					filtered = append(filtered, sv)
				}
			}

			local_roll := rand.Intn(len(filtered))
			body := map[string]Servant{"roll": filtered[local_roll]}
			c.JSON(http.StatusOK, body)
		}
	}

	return gin.HandlerFunc(fn)
}

func doMultiRoll(servants []Servant) gin.HandlerFunc {
	var guaranteed []Servant
	// var others []Servant

	for _, sv := range servants {
		if sv.Rarity >= 4 {
			guaranteed = append(guaranteed, sv)
		}
		// } else {
		// 	others = append(others, sv)
		// }
	}

	fn := func(c *gin.Context) {
		var results []Servant
		for i := 0; i < 11; i++ {
			if i == 0 {
				local_roll := rand.Intn(len(guaranteed))
				results = append(results, guaranteed[local_roll])
			} else {
				roll := rand.Intn(100) + 1

				if roll == 1 {
					var filtered []Servant

					for _, sv := range servants {
						if sv.Rarity == 5 {
							filtered = append(filtered, sv)
						}
					}

					local_roll := rand.Intn(len(filtered))
					results = append(results, filtered[local_roll])
				} else if roll > 1 && roll <= 4 {
					var filtered []Servant

					for _, sv := range servants {
						if sv.Rarity == 4 {
							filtered = append(filtered, sv)
						}
					}

					local_roll := rand.Intn(len(filtered))
					results = append(results, filtered[local_roll])

				} else {
					var filtered []Servant

					for _, sv := range servants {
						if sv.Rarity <= 3 {
							filtered = append(filtered, sv)
						}
					}

					local_roll := rand.Intn(len(filtered))
					results = append(results, filtered[local_roll])

				}
			}
		}

		body := map[string][]Servant{"rolls": results}
		c.JSON(http.StatusOK, body)
	}

	return gin.HandlerFunc(fn)
}

func main() {
	env.Load("./.env")

	SERVER_MODE := env.Get("SERVER_MODE", "debug")
	DATABASE_PATH := env.Get("DATABASE_PATH", "../database/sv_db.db")

	if SERVER_MODE == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		DATABASE_PATH = "../database/sv_db.db"
		gin.SetMode(gin.DebugMode)
	}

	db, _ := sql.Open("sqlite3", DATABASE_PATH)
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
	config := cors.Default()
	router.Use(config)

	router.GET("/roll/single", doSingleRoll(servants))
	router.GET("/roll/multi", doMultiRoll(servants))

	router.Run(":8080")
}
