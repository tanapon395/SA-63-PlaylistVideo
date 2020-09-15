package controllers

import (
	"context"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/playlist-video/ent"
	"github.com/tanapon395/playlist-video/ent/playlist"
	"github.com/tanapon395/playlist-video/ent/user"
)

type PlaylistController struct {
	client *ent.Client
	router gin.IRouter
}

type Playlist struct {
	Title string
	Owner int
}

func (ctl *PlaylistController) CreatePlaylist(c *gin.Context) {
	obj := Playlist{}
	if err := c.ShouldBind(&obj); err != nil {
		c.JSON(400, gin.H{
			"error": "playist binding failed",
		})
		return
	}

	u, err := ctl.client.User.
		Query().
		Where(user.IDEQ(int(obj.Owner))).
		Only(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "owner not found",
		})
		return
	}

	p, err := ctl.client.Playlist.
		Create().
		SetTitle(obj.Title).
		SetOwner(u).
		Save(context.Background())

	fmt.Println(err)

	if err != nil {
		c.JSON(400, gin.H{
			"error": "saving failed",
		})
		return
	}

	c.JSON(200, p)
}

func (ctl *PlaylistController) GetPlaylist(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	p, err := ctl.client.Playlist.
		Query().
		WithOwner().
		Where(playlist.IDEQ(int(id))).
		Only(context.Background())

	if err != nil {
		c.JSON(404, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, p)
}

func (ctl *PlaylistController) ListPlaylist(c *gin.Context) {
	limitQuery := c.Query("limit")
	limit := 10
	if limitQuery != "" {
		limit64, err := strconv.ParseInt(limitQuery, 10, 64)
		if err == nil {
			limit = int(limit64)
		}
	}

	offsetQuery := c.Query("offset")
	offset := 0
	if offsetQuery != "" {
		offset64, err := strconv.ParseInt(offsetQuery, 10, 64)
		if err == nil {
			offset = int(offset64)
		}
	}

	playlists, err := ctl.client.Playlist.
		Query().
		WithOwner().
		Limit(limit).
		Offset(offset).
		All(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, playlists)
}

// NewPlaylistController creates and registers handles for the user controller
func NewPlaylistController(router gin.IRouter, client *ent.Client) *PlaylistController {
	pc := &PlaylistController{
		client: client,
		router: router,
	}

	pc.register()

	return pc

}

func (ctl *PlaylistController) register() {
	playlists := ctl.router.Group("/playlists")

	playlists.POST("", ctl.CreatePlaylist)
	playlists.GET(":id", ctl.GetPlaylist)
	playlists.GET("", ctl.ListPlaylist)

}
