#!/usr/bin/env nu

def main [] {
  open ../config/tag_stacker-server.toml | update items.tags (open ../config/tag_stacker_tags.json) | save -f ../config/tag_stacker-server.toml
}