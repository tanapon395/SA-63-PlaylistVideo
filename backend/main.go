package main

import (
	"context"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/tanapon395/playlist-video/controllers"
	"github.com/tanapon395/playlist-video/ent"
	"github.com/tanapon395/playlist-video/ent/user"
)

type Users struct {
	User []User
}

type User struct {
	Name  string
	Email string
}

type Playlists struct {
	Playlist []Playlist
}

type Playlist struct {
	Title string
	Owner int
}

type Videos struct {
	Video []Video
}

type Video struct {
	Name  string
	Url   string
	Owner int
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	client, err := ent.Open("sqlite3", "file:ent.db?cache=shared&_fk=1")
	if err != nil {
		log.Fatalf("fail to open sqlite3: %v", err)
	}
	defer client.Close()

	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	v1 := router.Group("/api/v1")
	controllers.NewUserController(v1, client)
	controllers.NewVideoController(v1, client)
	controllers.NewResolutionController(v1, client)
	controllers.NewPlaylistController(v1, client)
	controllers.NewPlaylistVideoController(v1, client)

	// Set Users Data
	users := Users{
		User: []User{
			User{"Chanwit Kaewkasi", "chanwit@gmail.com"},
			User{"Name Surname", "me@example.com"},
		},
	}

	for _, u := range users.User {
		client.User.
			Create().
			SetEmail(u.Email).
			SetName(u.Name).
			Save(context.Background())
	}

	// Set Resolutions Data
	resolutions := []int{240, 360, 480, 720, 1080}
	for _, r := range resolutions {
		client.Resolution.
			Create().
			SetValue(r).
			Save(context.Background())
	}

	// Set Playlist Data
	playlists := Playlists{
		Playlist: []Playlist{
			Playlist{"Watched", 1},
			Playlist{"Watch Later", 1},
			Playlist{"Watch Later", 2},
		},
	}

	for _, p := range playlists.Playlist {

		u, err := client.User.
			Query().
			Where(user.IDEQ(int(p.Owner))).
			Only(context.Background())

		if err != nil {
			fmt.Println(err.Error())
			return
		}

		client.Playlist.
			Create().
			SetTitle(p.Title).
			SetOwner(u).
			Save(context.Background())
	}

	// Set Videos Data
	videos := Videos{
		Video: []Video{
			Video{"SA Lecture 4", "http://google.con", 1},
			Video{"React and TypeScript - Getting Started", "https://www.youtube.com/watch?v=I9jfsIRnySs&ab_channel=JamesQQuick", 2},
		},
	}

	for _, v := range videos.Video {

		u, err := client.User.
			Query().
			Where(user.IDEQ(int(v.Owner))).
			Only(context.Background())

		if err != nil {
			fmt.Println(err.Error())
			return
		}

		client.Video.
			Create().
			SetName(v.Name).
			SetURL(v.Url).
			SetOwner(u).
			Save(context.Background())
	}

	//    router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.Run()
}
