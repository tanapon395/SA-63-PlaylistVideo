package schema

import (
	"errors"
	"regexp"

	"github.com/facebook/ent"
	"github.com/facebook/ent/schema/edge"
	"github.com/facebook/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("student_id").Validate(func(s string) error {
			match, _ := regexp.MatchString("[BMD]\\d{7}", s)
			if !match {
				return errors.New("รูปแบบรหัสนักศึกษาไม่ถูกต้อง")
			}
			return nil
		}),
		// field.String("student_id").Match(regexp.MustCompile("[BMD]\\d{7}")),
		field.String("name").NotEmpty(),
		field.String("identification_number").MaxLen(13).MinLen(13),
		field.String("email").NotEmpty(),
		field.Int("age").Min(0),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("playlists", Playlist.Type).StorageKey(edge.Column("owner_id")),
		edge.To("videos", Video.Type).StorageKey(edge.Column("owner_id")),
	}
}
