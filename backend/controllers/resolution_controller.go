package controllers

import (
	"context"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/playlist-video/ent"
	"github.com/tanapon395/playlist-video/ent/resolution"
)

type ResolutionController struct {
	client *ent.Client
	router gin.IRouter
}

func (ctl *ResolutionController) CreateResolution(c *gin.Context) {
	obj := ent.Resolution{}
	if err := c.ShouldBind(&obj); err != nil {
		c.JSON(400, gin.H{
			"error": "resolution binding failed",
		})
		return
	}

	r, err := ctl.client.Resolution.
		Create().
		SetValue(obj.Value).
		Save(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": "saving failed",
		})
		return
	}

	c.JSON(200, r)
}

func (ctl *ResolutionController) GetResolution(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	r, err := ctl.client.Resolution.
		Query().
		Where(resolution.IDEQ(int(id))).
		Only(context.Background())

	if err != nil {
		c.JSON(404, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, r)
}

func (ctl *ResolutionController) ListResolution(c *gin.Context) {
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

	resolutions, err := ctl.client.Resolution.
		Query().
		Limit(limit).
		Offset(offset).
		All(context.Background())

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, resolutions)
}

// NewResolutionController creates and registers handles for the user controller
func NewResolutionController(router gin.IRouter, client *ent.Client) *ResolutionController {
	rc := &ResolutionController{
		client: client,
		router: router,
	}

	rc.register()

	return rc

}

func (ctl *ResolutionController) register() {
	resolutions := ctl.router.Group("/resolutions")

	resolutions.POST("", ctl.CreateResolution)
	resolutions.GET(":id", ctl.GetResolution)
	resolutions.GET("", ctl.ListResolution)

}
