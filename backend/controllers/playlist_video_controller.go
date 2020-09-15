package controllers

import (
	"context"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/playlist-video/ent"
	"github.com/tanapon395/playlist-video/ent/playlist"
	"github.com/tanapon395/playlist-video/ent/resolution"
	"github.com/tanapon395/playlist-video/ent/video"
)

type PlaylistVideoController struct {
	client *ent.Client
	router gin.IRouter
}

type PlaylistVideo struct {
	Playlist   int
	Video      int
	Resolution int
	Added      string
}

func (ctl *PlaylistVideoController) CreatePlaylistVideo(c *gin.Context) {
	obj := PlaylistVideo{}
	if err := c.ShouldBind(&obj); err != nil {
		c.JSON(400, gin.H{
			"error": "playist video binding failed",
		})
		return
	}

	p, err := ctl.client.Playlist.
		Query().
		Where(playlist.IDEQ(int(obj.Playlist))).
		Only(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "playlist not found",
		})
		return
	}

	v, err := ctl.client.Video.
		Query().
		Where(video.IDEQ(int(obj.Video))).
		Only(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "video not found",
		})
		return
	}

	r, err := ctl.client.Resolution.
		Query().
		Where(resolution.IDEQ(int(obj.Resolution))).
		Only(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "resolution not found",
		})
		return
	}

	time, err := time.Parse(time.RFC3339, obj.Added)
	pv, err := ctl.client.Playlist_Video.
		Create().
		SetAddedTime(time).
		SetPlaylist(p).
		SetVideo(v).
		SetResolution(r).
		Save(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "saving failed",
		})
		return
	}

	c.JSON(200, pv)
}

func (ctl *PlaylistVideoController) ListPlaylistVideo(c *gin.Context) {
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

	playlistVideos, err := ctl.client.Playlist_Video.
		Query().
		WithPlaylist().
		WithResolution().
		WithVideo().
		Limit(limit).
		Offset(offset).
		All(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, playlistVideos)
}

// NewPlaylistVideoController creates and registers handles for the user controller
func NewPlaylistVideoController(router gin.IRouter, client *ent.Client) *PlaylistVideoController {
	pvc := &PlaylistVideoController{
		client: client,
		router: router,
	}

	pvc.register()

	return pvc

}

func (ctl *PlaylistVideoController) register() {
	playlistVideos := ctl.router.Group("/playlist-videos")

	playlistVideos.POST("", ctl.CreatePlaylistVideo)
	playlistVideos.GET("", ctl.ListPlaylistVideo)

}
