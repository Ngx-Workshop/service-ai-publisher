// Generated from catalog.schemas.ts; do not edit.
export const mcpPublisherContract = {
  "name": "ngx-workshop-publisher",
  "version": "0.1.0",
  "publishing": {
    "endpoint": "/mcp/publishing",
    "authentication": "platform administrator bearer",
    "tools": [
      {
        "name": "list_workshop_drafts",
        "description": "List your saved workshop drafts, fifty at a time. Pass the last draftId as before for the next page.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "before": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "draftId": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "version": {
                    "type": "integer",
                    "exclusiveMinimum": 0,
                    "maximum": 9007199254740991
                  },
                  "name": {
                    "type": "string",
                    "maxLength": 160
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "running",
                      "interrupted",
                      "ready",
                      "needs_attention",
                      "edited",
                      "published"
                    ]
                  },
                  "previousPreparationId": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "publishedRequestId": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "preparationId": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "createdAt": {
                    "type": "string"
                  },
                  "updatedAt": {
                    "type": "string"
                  }
                },
                "required": [
                  "draftId",
                  "version",
                  "name",
                  "status",
                  "createdAt",
                  "updatedAt"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "get_workshop_draft",
        "description": "Read your saved workshop source and latest preparation reference.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "draftId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "required": [
            "draftId"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "draftId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "version": {
                  "type": "integer",
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991
                },
                "name": {
                  "type": "string",
                  "maxLength": 160
                },
                "json": {
                  "type": "string",
                  "maxLength": 6000000
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "running",
                    "interrupted",
                    "ready",
                    "needs_attention",
                    "edited",
                    "published"
                  ]
                },
                "brief": {
                  "type": "object",
                  "properties": {
                    "brief": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "model": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionId": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    }
                  },
                  "required": [
                    "brief",
                    "sectionId",
                    "level"
                  ],
                  "additionalProperties": false
                },
                "previousPreparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "publishedRequestId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "createdAt": {
                  "type": "string"
                },
                "updatedAt": {
                  "type": "string"
                }
              },
              "required": [
                "draftId",
                "version",
                "name",
                "json",
                "status",
                "createdAt",
                "updatedAt"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "save_workshop_draft",
        "description": "Save edited workshop source with optimistic revision protection. Edits require new checks.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": false,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "draftId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "version": {
              "type": "integer",
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991
            },
            "json": {
              "type": "string",
              "maxLength": 6000000
            }
          },
          "required": [
            "draftId",
            "version",
            "json"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "draftId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "version": {
                  "type": "integer",
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991
                },
                "name": {
                  "type": "string",
                  "maxLength": 160
                },
                "json": {
                  "type": "string",
                  "maxLength": 6000000
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "running",
                    "interrupted",
                    "ready",
                    "needs_attention",
                    "edited",
                    "published"
                  ]
                },
                "brief": {
                  "type": "object",
                  "properties": {
                    "brief": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "model": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionId": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    }
                  },
                  "required": [
                    "brief",
                    "sectionId",
                    "level"
                  ],
                  "additionalProperties": false
                },
                "previousPreparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "publishedRequestId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "createdAt": {
                  "type": "string"
                },
                "updatedAt": {
                  "type": "string"
                }
              },
              "required": [
                "draftId",
                "version",
                "name",
                "json",
                "status",
                "createdAt",
                "updatedAt"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "get_workshop_repair_options",
        "description": "List current failed content checks eligible for one explicit AI revision. This read does not call a model; service and provider outages are excluded.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "preparationId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "required": [
            "preparationId"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftHash": {
                  "type": "string",
                  "pattern": "^[a-f0-9]{64}$"
                },
                "model": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "activities": {
                  "maxItems": 100,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "activityId": {
                        "type": "string"
                      },
                      "label": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "activityId",
                      "label"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "preparationId",
                "model",
                "activities"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "start_workshop_preparation",
        "description": "Start private generation, checks, or an explicit targeted AI repair without owner writes. Poll get_workshop_preparation. Explicit repair makes one revision and rechecks; it never automatically repairs again.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": false,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "generate"
                },
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftVersion": {
                  "type": "integer",
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991
                },
                "input": {
                  "type": "object",
                  "properties": {
                    "brief": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "model": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionId": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    }
                  },
                  "required": [
                    "brief",
                    "sectionId",
                    "level"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "input"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "check"
                },
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftVersion": {
                  "type": "integer",
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991
                },
                "draft": {}
              },
              "required": [
                "operation",
                "draft"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "repair"
                },
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "draftVersion": {
                  "type": "integer",
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991
                },
                "sourcePreparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "expectedDraftHash": {
                  "type": "string",
                  "pattern": "^[a-f0-9]{64}$"
                },
                "activityId": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 200
                },
                "model": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                }
              },
              "required": [
                "operation",
                "sourcePreparationId",
                "expectedDraftHash",
                "activityId"
              ],
              "additionalProperties": false
            }
          ]
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "running",
                    "complete",
                    "failed"
                  ]
                },
                "ready": {
                  "type": "boolean"
                },
                "createdAt": {
                  "type": "string"
                },
                "updatedAt": {
                  "type": "string"
                },
                "activities": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string"
                      },
                      "label": {
                        "type": "string"
                      },
                      "kind": {
                        "type": "string",
                        "enum": [
                          "skill",
                          "generation",
                          "check",
                          "review",
                          "repair"
                        ]
                      },
                      "status": {
                        "type": "string",
                        "enum": [
                          "pending",
                          "running",
                          "passed",
                          "failed",
                          "skipped",
                          "review_required"
                        ]
                      },
                      "detail": {
                        "type": "string",
                        "maxLength": 4000
                      },
                      "startedAt": {
                        "type": "string"
                      },
                      "finishedAt": {
                        "type": "string"
                      },
                      "skillVersion": {
                        "type": "string"
                      },
                      "skillHash": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "id",
                      "label",
                      "kind",
                      "status",
                      "detail"
                    ],
                    "additionalProperties": false
                  }
                },
                "repairCount": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1
                },
                "model": {
                  "type": "string"
                },
                "draft": {
                  "type": "object",
                  "properties": {
                    "learningPlan": {
                      "type": "object",
                      "properties": {
                        "prerequisites": {
                          "maxItems": 20,
                          "type": "array",
                          "items": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          }
                        },
                        "objectives": {
                          "minItems": 1,
                          "maxItems": 20,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "objective": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 600
                              },
                              "pageIndexes": {
                                "minItems": 1,
                                "maxItems": 20,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              },
                              "labIndexes": {
                                "minItems": 1,
                                "maxItems": 10,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              },
                              "questionIndexes": {
                                "minItems": 1,
                                "maxItems": 100,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              }
                            },
                            "required": [
                              "objective",
                              "pageIndexes",
                              "labIndexes",
                              "questionIndexes"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "prerequisites",
                        "objectives"
                      ],
                      "additionalProperties": false
                    },
                    "sectionId": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "summary": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "pages": {
                      "minItems": 1,
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 160
                          },
                          "blocks": {
                            "minItems": 1,
                            "maxItems": 200,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "blockId": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 120
                                },
                                "sortIndex": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                },
                                "componentInstanceName": {
                                  "type": "string",
                                  "enum": [
                                    "HeaderBlockComponent",
                                    "ParagraphBlockComponent",
                                    "NgxEditorJs2BlockquotesComponent",
                                    "NgxEditorJs2PanelComponent",
                                    "NgxEditorJs2ImageComponent",
                                    "NgxEditorJs2CodemirrorComponent",
                                    "NgxEditorJs2MermaidjsComponent",
                                    "NgxEditorJs2PopQuizComponent"
                                  ]
                                },
                                "savedAction": {
                                  "type": "string",
                                  "maxLength": 120
                                },
                                "dataClean": {
                                  "type": "string",
                                  "maxLength": 100000
                                }
                              },
                              "required": [
                                "blockId",
                                "sortIndex",
                                "componentInstanceName",
                                "savedAction",
                                "dataClean"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "name",
                          "blocks"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "labs": {
                      "minItems": 1,
                      "maxItems": 10,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "metadata": {
                            "type": "object",
                            "properties": {
                              "title": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 160
                              },
                              "slug": {
                                "type": "string",
                                "maxLength": 200,
                                "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                              },
                              "summary": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 20000
                              },
                              "difficulty": {
                                "type": "string",
                                "enum": [
                                  "intro",
                                  "easy",
                                  "medium",
                                  "hard"
                                ]
                              }
                            },
                            "required": [
                              "title",
                              "slug",
                              "summary",
                              "difficulty"
                            ],
                            "additionalProperties": false
                          },
                          "version": {
                            "type": "object",
                            "properties": {
                              "language": {
                                "type": "string",
                                "enum": [
                                  "javascript",
                                  "typescript"
                                ]
                              },
                              "promptMarkdown": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 20000
                              },
                              "hints": {
                                "maxItems": 30,
                                "type": "array",
                                "items": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 20000
                                }
                              },
                              "starterCode": {
                                "type": "string",
                                "maxLength": 50000
                              },
                              "referenceSolution": {
                                "type": "object",
                                "properties": {
                                  "code": {
                                    "type": "string",
                                    "minLength": 1,
                                    "maxLength": 50000
                                  }
                                },
                                "required": [
                                  "code"
                                ],
                                "additionalProperties": false
                              },
                              "sampleTests": {
                                "minItems": 1,
                                "maxItems": 50,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "name": {
                                      "type": "string",
                                      "maxLength": 2000
                                    },
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "io",
                                        "unit"
                                      ]
                                    },
                                    "input": {},
                                    "expected": {},
                                    "comparator": {
                                      "type": "object",
                                      "properties": {
                                        "kind": {
                                          "type": "string",
                                          "enum": [
                                            "deepEqual",
                                            "strictEqual",
                                            "numberTolerance",
                                            "stringNormalized",
                                            "custom"
                                          ]
                                        },
                                        "tolerance": {
                                          "type": "number"
                                        },
                                        "normalizeWhitespace": {
                                          "type": "boolean"
                                        },
                                        "ignoreCase": {
                                          "type": "boolean"
                                        },
                                        "customComparatorId": {
                                          "type": "string"
                                        }
                                      },
                                      "required": [
                                        "kind"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "testCode": {
                                      "type": "string",
                                      "maxLength": 50000
                                    },
                                    "framework": {
                                      "type": "string",
                                      "enum": [
                                        "jest",
                                        "vitest"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "name",
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "hiddenTests": {
                                "minItems": 1,
                                "maxItems": 50,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "name": {
                                      "type": "string",
                                      "maxLength": 2000
                                    },
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "io",
                                        "unit"
                                      ]
                                    },
                                    "input": {},
                                    "expected": {},
                                    "comparator": {
                                      "type": "object",
                                      "properties": {
                                        "kind": {
                                          "type": "string",
                                          "enum": [
                                            "deepEqual",
                                            "strictEqual",
                                            "numberTolerance",
                                            "stringNormalized",
                                            "custom"
                                          ]
                                        },
                                        "tolerance": {
                                          "type": "number"
                                        },
                                        "normalizeWhitespace": {
                                          "type": "boolean"
                                        },
                                        "ignoreCase": {
                                          "type": "boolean"
                                        },
                                        "customComparatorId": {
                                          "type": "string"
                                        }
                                      },
                                      "required": [
                                        "kind"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "testCode": {
                                      "type": "string",
                                      "maxLength": 50000
                                    },
                                    "framework": {
                                      "type": "string",
                                      "enum": [
                                        "jest",
                                        "vitest"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "name",
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "runner": {
                                "type": "object",
                                "properties": {
                                  "timeoutMs": {
                                    "type": "integer",
                                    "minimum": 100,
                                    "maximum": 10000
                                  },
                                  "entryFnName": {
                                    "type": "string",
                                    "pattern": "^[a-zA-Z_$][\\w$]*$"
                                  }
                                },
                                "required": [
                                  "timeoutMs",
                                  "entryFnName"
                                ],
                                "additionalProperties": false
                              }
                            },
                            "required": [
                              "language",
                              "promptMarkdown",
                              "hints",
                              "starterCode",
                              "referenceSolution",
                              "sampleTests",
                              "hiddenTests",
                              "runner"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "required": [
                          "metadata",
                          "version"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "assessment": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 160
                        },
                        "subject": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 120
                        },
                        "sectionTitle": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 120
                        },
                        "level": {
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 20
                        },
                        "testQuestions": {
                          "minItems": 1,
                          "maxItems": 100,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "question": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              },
                              "choices": {
                                "minItems": 2,
                                "maxItems": 10,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "value": {
                                      "type": "string",
                                      "minLength": 1,
                                      "maxLength": 400
                                    }
                                  },
                                  "required": [
                                    "value"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "answer": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 400
                              },
                              "correctResponse": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              },
                              "incorrectResponse": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              }
                            },
                            "required": [
                              "question",
                              "choices",
                              "answer",
                              "correctResponse",
                              "incorrectResponse"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "name",
                        "subject",
                        "level",
                        "testQuestions"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "sectionId",
                    "name",
                    "summary",
                    "level",
                    "pages",
                    "labs",
                    "assessment"
                  ],
                  "additionalProperties": false
                },
                "draftHash": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              },
              "required": [
                "preparationId",
                "status",
                "ready",
                "createdAt",
                "updatedAt",
                "activities",
                "repairCount"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "get_workshop_preparation",
        "description": "Read private preparation progress and checked draft; reports persist across restarts; interrupted work requires fresh checks.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "preparationId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "required": [
            "preparationId"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "preparationId": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "running",
                    "complete",
                    "failed"
                  ]
                },
                "ready": {
                  "type": "boolean"
                },
                "createdAt": {
                  "type": "string"
                },
                "updatedAt": {
                  "type": "string"
                },
                "activities": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string"
                      },
                      "label": {
                        "type": "string"
                      },
                      "kind": {
                        "type": "string",
                        "enum": [
                          "skill",
                          "generation",
                          "check",
                          "review",
                          "repair"
                        ]
                      },
                      "status": {
                        "type": "string",
                        "enum": [
                          "pending",
                          "running",
                          "passed",
                          "failed",
                          "skipped",
                          "review_required"
                        ]
                      },
                      "detail": {
                        "type": "string",
                        "maxLength": 4000
                      },
                      "startedAt": {
                        "type": "string"
                      },
                      "finishedAt": {
                        "type": "string"
                      },
                      "skillVersion": {
                        "type": "string"
                      },
                      "skillHash": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "id",
                      "label",
                      "kind",
                      "status",
                      "detail"
                    ],
                    "additionalProperties": false
                  }
                },
                "repairCount": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1
                },
                "model": {
                  "type": "string"
                },
                "draft": {
                  "type": "object",
                  "properties": {
                    "learningPlan": {
                      "type": "object",
                      "properties": {
                        "prerequisites": {
                          "maxItems": 20,
                          "type": "array",
                          "items": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          }
                        },
                        "objectives": {
                          "minItems": 1,
                          "maxItems": 20,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "objective": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 600
                              },
                              "pageIndexes": {
                                "minItems": 1,
                                "maxItems": 20,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              },
                              "labIndexes": {
                                "minItems": 1,
                                "maxItems": 10,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              },
                              "questionIndexes": {
                                "minItems": 1,
                                "maxItems": 100,
                                "type": "array",
                                "items": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                }
                              }
                            },
                            "required": [
                              "objective",
                              "pageIndexes",
                              "labIndexes",
                              "questionIndexes"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "prerequisites",
                        "objectives"
                      ],
                      "additionalProperties": false
                    },
                    "sectionId": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "summary": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "pages": {
                      "minItems": 1,
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 160
                          },
                          "blocks": {
                            "minItems": 1,
                            "maxItems": 200,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "blockId": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 120
                                },
                                "sortIndex": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 9007199254740991
                                },
                                "componentInstanceName": {
                                  "type": "string",
                                  "enum": [
                                    "HeaderBlockComponent",
                                    "ParagraphBlockComponent",
                                    "NgxEditorJs2BlockquotesComponent",
                                    "NgxEditorJs2PanelComponent",
                                    "NgxEditorJs2ImageComponent",
                                    "NgxEditorJs2CodemirrorComponent",
                                    "NgxEditorJs2MermaidjsComponent",
                                    "NgxEditorJs2PopQuizComponent"
                                  ]
                                },
                                "savedAction": {
                                  "type": "string",
                                  "maxLength": 120
                                },
                                "dataClean": {
                                  "type": "string",
                                  "maxLength": 100000
                                }
                              },
                              "required": [
                                "blockId",
                                "sortIndex",
                                "componentInstanceName",
                                "savedAction",
                                "dataClean"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "name",
                          "blocks"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "labs": {
                      "minItems": 1,
                      "maxItems": 10,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "metadata": {
                            "type": "object",
                            "properties": {
                              "title": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 160
                              },
                              "slug": {
                                "type": "string",
                                "maxLength": 200,
                                "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                              },
                              "summary": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 20000
                              },
                              "difficulty": {
                                "type": "string",
                                "enum": [
                                  "intro",
                                  "easy",
                                  "medium",
                                  "hard"
                                ]
                              }
                            },
                            "required": [
                              "title",
                              "slug",
                              "summary",
                              "difficulty"
                            ],
                            "additionalProperties": false
                          },
                          "version": {
                            "type": "object",
                            "properties": {
                              "language": {
                                "type": "string",
                                "enum": [
                                  "javascript",
                                  "typescript"
                                ]
                              },
                              "promptMarkdown": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 20000
                              },
                              "hints": {
                                "maxItems": 30,
                                "type": "array",
                                "items": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 20000
                                }
                              },
                              "starterCode": {
                                "type": "string",
                                "maxLength": 50000
                              },
                              "referenceSolution": {
                                "type": "object",
                                "properties": {
                                  "code": {
                                    "type": "string",
                                    "minLength": 1,
                                    "maxLength": 50000
                                  }
                                },
                                "required": [
                                  "code"
                                ],
                                "additionalProperties": false
                              },
                              "sampleTests": {
                                "minItems": 1,
                                "maxItems": 50,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "name": {
                                      "type": "string",
                                      "maxLength": 2000
                                    },
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "io",
                                        "unit"
                                      ]
                                    },
                                    "input": {},
                                    "expected": {},
                                    "comparator": {
                                      "type": "object",
                                      "properties": {
                                        "kind": {
                                          "type": "string",
                                          "enum": [
                                            "deepEqual",
                                            "strictEqual",
                                            "numberTolerance",
                                            "stringNormalized",
                                            "custom"
                                          ]
                                        },
                                        "tolerance": {
                                          "type": "number"
                                        },
                                        "normalizeWhitespace": {
                                          "type": "boolean"
                                        },
                                        "ignoreCase": {
                                          "type": "boolean"
                                        },
                                        "customComparatorId": {
                                          "type": "string"
                                        }
                                      },
                                      "required": [
                                        "kind"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "testCode": {
                                      "type": "string",
                                      "maxLength": 50000
                                    },
                                    "framework": {
                                      "type": "string",
                                      "enum": [
                                        "jest",
                                        "vitest"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "name",
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "hiddenTests": {
                                "minItems": 1,
                                "maxItems": 50,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "name": {
                                      "type": "string",
                                      "maxLength": 2000
                                    },
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "io",
                                        "unit"
                                      ]
                                    },
                                    "input": {},
                                    "expected": {},
                                    "comparator": {
                                      "type": "object",
                                      "properties": {
                                        "kind": {
                                          "type": "string",
                                          "enum": [
                                            "deepEqual",
                                            "strictEqual",
                                            "numberTolerance",
                                            "stringNormalized",
                                            "custom"
                                          ]
                                        },
                                        "tolerance": {
                                          "type": "number"
                                        },
                                        "normalizeWhitespace": {
                                          "type": "boolean"
                                        },
                                        "ignoreCase": {
                                          "type": "boolean"
                                        },
                                        "customComparatorId": {
                                          "type": "string"
                                        }
                                      },
                                      "required": [
                                        "kind"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "testCode": {
                                      "type": "string",
                                      "maxLength": 50000
                                    },
                                    "framework": {
                                      "type": "string",
                                      "enum": [
                                        "jest",
                                        "vitest"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "name",
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "runner": {
                                "type": "object",
                                "properties": {
                                  "timeoutMs": {
                                    "type": "integer",
                                    "minimum": 100,
                                    "maximum": 10000
                                  },
                                  "entryFnName": {
                                    "type": "string",
                                    "pattern": "^[a-zA-Z_$][\\w$]*$"
                                  }
                                },
                                "required": [
                                  "timeoutMs",
                                  "entryFnName"
                                ],
                                "additionalProperties": false
                              }
                            },
                            "required": [
                              "language",
                              "promptMarkdown",
                              "hints",
                              "starterCode",
                              "referenceSolution",
                              "sampleTests",
                              "hiddenTests",
                              "runner"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "required": [
                          "metadata",
                          "version"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "assessment": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 160
                        },
                        "subject": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 120
                        },
                        "sectionTitle": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 120
                        },
                        "level": {
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 20
                        },
                        "testQuestions": {
                          "minItems": 1,
                          "maxItems": 100,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "question": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              },
                              "choices": {
                                "minItems": 2,
                                "maxItems": 10,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "value": {
                                      "type": "string",
                                      "minLength": 1,
                                      "maxLength": 400
                                    }
                                  },
                                  "required": [
                                    "value"
                                  ],
                                  "additionalProperties": false
                                }
                              },
                              "answer": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 400
                              },
                              "correctResponse": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              },
                              "incorrectResponse": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 1000
                              }
                            },
                            "required": [
                              "question",
                              "choices",
                              "answer",
                              "correctResponse",
                              "incorrectResponse"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "name",
                        "subject",
                        "level",
                        "testQuestions"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "sectionId",
                    "name",
                    "summary",
                    "level",
                    "pages",
                    "labs",
                    "assessment"
                  ],
                  "additionalProperties": false
                },
                "draftHash": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              },
              "required": [
                "preparationId",
                "status",
                "ready",
                "createdAt",
                "updatedAt",
                "activities",
                "repairCount"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "list_publishing_models",
        "description": "List server-approved draft models and reference USD token pricing.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {},
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "list_publishing_runs",
        "description": "List durable publishing receipts for the authenticated administrator, newest first.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {},
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "generate_workshop_draft",
        "description": "Generate documentation, labs and assessment from a brief; no owner writes. Review before publish.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "brief": {
              "type": "string",
              "minLength": 1,
              "maxLength": 20000
            },
            "model": {
              "type": "string",
              "minLength": 1,
              "maxLength": 120
            },
            "sectionId": {
              "type": "string",
              "minLength": 1,
              "maxLength": 120
            },
            "level": {
              "type": "integer",
              "minimum": 1,
              "maximum": 20
            }
          },
          "required": [
            "brief",
            "sectionId",
            "level"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "validate_workshop_draft",
        "description": "Validate and normalize Ngx-EditorJs2 workshop draft without writing.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "draft": {
              "type": "object",
              "properties": {
                "learningPlan": {
                  "type": "object",
                  "properties": {
                    "prerequisites": {
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 400
                      }
                    },
                    "objectives": {
                      "minItems": 1,
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "objective": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 600
                          },
                          "pageIndexes": {
                            "minItems": 1,
                            "maxItems": 20,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          },
                          "labIndexes": {
                            "minItems": 1,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          },
                          "questionIndexes": {
                            "minItems": 1,
                            "maxItems": 100,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          }
                        },
                        "required": [
                          "objective",
                          "pageIndexes",
                          "labIndexes",
                          "questionIndexes"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "prerequisites",
                    "objectives"
                  ],
                  "additionalProperties": false
                },
                "sectionId": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                },
                "summary": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                },
                "level": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 20
                },
                "pages": {
                  "minItems": 1,
                  "maxItems": 20,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 160
                      },
                      "blocks": {
                        "minItems": 1,
                        "maxItems": 200,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "blockId": {
                              "type": "string",
                              "minLength": 1,
                              "maxLength": 120
                            },
                            "sortIndex": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            },
                            "componentInstanceName": {
                              "type": "string",
                              "enum": [
                                "HeaderBlockComponent",
                                "ParagraphBlockComponent",
                                "NgxEditorJs2BlockquotesComponent",
                                "NgxEditorJs2PanelComponent",
                                "NgxEditorJs2ImageComponent",
                                "NgxEditorJs2CodemirrorComponent",
                                "NgxEditorJs2MermaidjsComponent",
                                "NgxEditorJs2PopQuizComponent"
                              ]
                            },
                            "savedAction": {
                              "type": "string",
                              "maxLength": 120
                            },
                            "dataClean": {
                              "type": "string",
                              "maxLength": 100000
                            }
                          },
                          "required": [
                            "blockId",
                            "sortIndex",
                            "componentInstanceName",
                            "savedAction",
                            "dataClean"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "name",
                      "blocks"
                    ],
                    "additionalProperties": false
                  }
                },
                "labs": {
                  "minItems": 1,
                  "maxItems": 10,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "metadata": {
                        "type": "object",
                        "properties": {
                          "title": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 160
                          },
                          "slug": {
                            "type": "string",
                            "maxLength": 200,
                            "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                          },
                          "summary": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 20000
                          },
                          "difficulty": {
                            "type": "string",
                            "enum": [
                              "intro",
                              "easy",
                              "medium",
                              "hard"
                            ]
                          }
                        },
                        "required": [
                          "title",
                          "slug",
                          "summary",
                          "difficulty"
                        ],
                        "additionalProperties": false
                      },
                      "version": {
                        "type": "object",
                        "properties": {
                          "language": {
                            "type": "string",
                            "enum": [
                              "javascript",
                              "typescript"
                            ]
                          },
                          "promptMarkdown": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 20000
                          },
                          "hints": {
                            "maxItems": 30,
                            "type": "array",
                            "items": {
                              "type": "string",
                              "minLength": 1,
                              "maxLength": 20000
                            }
                          },
                          "starterCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "referenceSolution": {
                            "type": "object",
                            "properties": {
                              "code": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 50000
                              }
                            },
                            "required": [
                              "code"
                            ],
                            "additionalProperties": false
                          },
                          "sampleTests": {
                            "minItems": 1,
                            "maxItems": 50,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "maxLength": 2000
                                },
                                "kind": {
                                  "type": "string",
                                  "enum": [
                                    "io",
                                    "unit"
                                  ]
                                },
                                "input": {},
                                "expected": {},
                                "comparator": {
                                  "type": "object",
                                  "properties": {
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "deepEqual",
                                        "strictEqual",
                                        "numberTolerance",
                                        "stringNormalized",
                                        "custom"
                                      ]
                                    },
                                    "tolerance": {
                                      "type": "number"
                                    },
                                    "normalizeWhitespace": {
                                      "type": "boolean"
                                    },
                                    "ignoreCase": {
                                      "type": "boolean"
                                    },
                                    "customComparatorId": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                },
                                "testCode": {
                                  "type": "string",
                                  "maxLength": 50000
                                },
                                "framework": {
                                  "type": "string",
                                  "enum": [
                                    "jest",
                                    "vitest"
                                  ]
                                }
                              },
                              "required": [
                                "name",
                                "kind"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "hiddenTests": {
                            "minItems": 1,
                            "maxItems": 50,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "maxLength": 2000
                                },
                                "kind": {
                                  "type": "string",
                                  "enum": [
                                    "io",
                                    "unit"
                                  ]
                                },
                                "input": {},
                                "expected": {},
                                "comparator": {
                                  "type": "object",
                                  "properties": {
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "deepEqual",
                                        "strictEqual",
                                        "numberTolerance",
                                        "stringNormalized",
                                        "custom"
                                      ]
                                    },
                                    "tolerance": {
                                      "type": "number"
                                    },
                                    "normalizeWhitespace": {
                                      "type": "boolean"
                                    },
                                    "ignoreCase": {
                                      "type": "boolean"
                                    },
                                    "customComparatorId": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                },
                                "testCode": {
                                  "type": "string",
                                  "maxLength": 50000
                                },
                                "framework": {
                                  "type": "string",
                                  "enum": [
                                    "jest",
                                    "vitest"
                                  ]
                                }
                              },
                              "required": [
                                "name",
                                "kind"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "runner": {
                            "type": "object",
                            "properties": {
                              "timeoutMs": {
                                "type": "integer",
                                "minimum": 100,
                                "maximum": 10000
                              },
                              "entryFnName": {
                                "type": "string",
                                "pattern": "^[a-zA-Z_$][\\w$]*$"
                              }
                            },
                            "required": [
                              "timeoutMs",
                              "entryFnName"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "required": [
                          "language",
                          "promptMarkdown",
                          "hints",
                          "starterCode",
                          "referenceSolution",
                          "sampleTests",
                          "hiddenTests",
                          "runner"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "metadata",
                      "version"
                    ],
                    "additionalProperties": false
                  }
                },
                "assessment": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "subject": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionTitle": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "testQuestions": {
                      "minItems": 1,
                      "maxItems": 100,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "question": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "choices": {
                            "minItems": 2,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "value": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 400
                                }
                              },
                              "required": [
                                "value"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "answer": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          },
                          "correctResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "incorrectResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          }
                        },
                        "required": [
                          "question",
                          "choices",
                          "answer",
                          "correctResponse",
                          "incorrectResponse"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "name",
                    "subject",
                    "level",
                    "testQuestions"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "sectionId",
                "name",
                "summary",
                "level",
                "pages",
                "labs",
                "assessment"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "draft"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "publish_workshop",
        "description": "Publish reviewed workshop. Keep requestId for duplicate protection and recovery. Returns completed resource steps on failure.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": true,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "requestId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "draft": {
              "type": "object",
              "properties": {
                "learningPlan": {
                  "type": "object",
                  "properties": {
                    "prerequisites": {
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 400
                      }
                    },
                    "objectives": {
                      "minItems": 1,
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "objective": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 600
                          },
                          "pageIndexes": {
                            "minItems": 1,
                            "maxItems": 20,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          },
                          "labIndexes": {
                            "minItems": 1,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          },
                          "questionIndexes": {
                            "minItems": 1,
                            "maxItems": 100,
                            "type": "array",
                            "items": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          }
                        },
                        "required": [
                          "objective",
                          "pageIndexes",
                          "labIndexes",
                          "questionIndexes"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "prerequisites",
                    "objectives"
                  ],
                  "additionalProperties": false
                },
                "sectionId": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                },
                "summary": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                },
                "level": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 20
                },
                "pages": {
                  "minItems": 1,
                  "maxItems": 20,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 160
                      },
                      "blocks": {
                        "minItems": 1,
                        "maxItems": 200,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "blockId": {
                              "type": "string",
                              "minLength": 1,
                              "maxLength": 120
                            },
                            "sortIndex": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            },
                            "componentInstanceName": {
                              "type": "string",
                              "enum": [
                                "HeaderBlockComponent",
                                "ParagraphBlockComponent",
                                "NgxEditorJs2BlockquotesComponent",
                                "NgxEditorJs2PanelComponent",
                                "NgxEditorJs2ImageComponent",
                                "NgxEditorJs2CodemirrorComponent",
                                "NgxEditorJs2MermaidjsComponent",
                                "NgxEditorJs2PopQuizComponent"
                              ]
                            },
                            "savedAction": {
                              "type": "string",
                              "maxLength": 120
                            },
                            "dataClean": {
                              "type": "string",
                              "maxLength": 100000
                            }
                          },
                          "required": [
                            "blockId",
                            "sortIndex",
                            "componentInstanceName",
                            "savedAction",
                            "dataClean"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "name",
                      "blocks"
                    ],
                    "additionalProperties": false
                  }
                },
                "labs": {
                  "minItems": 1,
                  "maxItems": 10,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "metadata": {
                        "type": "object",
                        "properties": {
                          "title": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 160
                          },
                          "slug": {
                            "type": "string",
                            "maxLength": 200,
                            "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                          },
                          "summary": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 20000
                          },
                          "difficulty": {
                            "type": "string",
                            "enum": [
                              "intro",
                              "easy",
                              "medium",
                              "hard"
                            ]
                          }
                        },
                        "required": [
                          "title",
                          "slug",
                          "summary",
                          "difficulty"
                        ],
                        "additionalProperties": false
                      },
                      "version": {
                        "type": "object",
                        "properties": {
                          "language": {
                            "type": "string",
                            "enum": [
                              "javascript",
                              "typescript"
                            ]
                          },
                          "promptMarkdown": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 20000
                          },
                          "hints": {
                            "maxItems": 30,
                            "type": "array",
                            "items": {
                              "type": "string",
                              "minLength": 1,
                              "maxLength": 20000
                            }
                          },
                          "starterCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "referenceSolution": {
                            "type": "object",
                            "properties": {
                              "code": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 50000
                              }
                            },
                            "required": [
                              "code"
                            ],
                            "additionalProperties": false
                          },
                          "sampleTests": {
                            "minItems": 1,
                            "maxItems": 50,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "maxLength": 2000
                                },
                                "kind": {
                                  "type": "string",
                                  "enum": [
                                    "io",
                                    "unit"
                                  ]
                                },
                                "input": {},
                                "expected": {},
                                "comparator": {
                                  "type": "object",
                                  "properties": {
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "deepEqual",
                                        "strictEqual",
                                        "numberTolerance",
                                        "stringNormalized",
                                        "custom"
                                      ]
                                    },
                                    "tolerance": {
                                      "type": "number"
                                    },
                                    "normalizeWhitespace": {
                                      "type": "boolean"
                                    },
                                    "ignoreCase": {
                                      "type": "boolean"
                                    },
                                    "customComparatorId": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                },
                                "testCode": {
                                  "type": "string",
                                  "maxLength": 50000
                                },
                                "framework": {
                                  "type": "string",
                                  "enum": [
                                    "jest",
                                    "vitest"
                                  ]
                                }
                              },
                              "required": [
                                "name",
                                "kind"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "hiddenTests": {
                            "minItems": 1,
                            "maxItems": 50,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "maxLength": 2000
                                },
                                "kind": {
                                  "type": "string",
                                  "enum": [
                                    "io",
                                    "unit"
                                  ]
                                },
                                "input": {},
                                "expected": {},
                                "comparator": {
                                  "type": "object",
                                  "properties": {
                                    "kind": {
                                      "type": "string",
                                      "enum": [
                                        "deepEqual",
                                        "strictEqual",
                                        "numberTolerance",
                                        "stringNormalized",
                                        "custom"
                                      ]
                                    },
                                    "tolerance": {
                                      "type": "number"
                                    },
                                    "normalizeWhitespace": {
                                      "type": "boolean"
                                    },
                                    "ignoreCase": {
                                      "type": "boolean"
                                    },
                                    "customComparatorId": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "kind"
                                  ],
                                  "additionalProperties": false
                                },
                                "testCode": {
                                  "type": "string",
                                  "maxLength": 50000
                                },
                                "framework": {
                                  "type": "string",
                                  "enum": [
                                    "jest",
                                    "vitest"
                                  ]
                                }
                              },
                              "required": [
                                "name",
                                "kind"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "runner": {
                            "type": "object",
                            "properties": {
                              "timeoutMs": {
                                "type": "integer",
                                "minimum": 100,
                                "maximum": 10000
                              },
                              "entryFnName": {
                                "type": "string",
                                "pattern": "^[a-zA-Z_$][\\w$]*$"
                              }
                            },
                            "required": [
                              "timeoutMs",
                              "entryFnName"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "required": [
                          "language",
                          "promptMarkdown",
                          "hints",
                          "starterCode",
                          "referenceSolution",
                          "sampleTests",
                          "hiddenTests",
                          "runner"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "required": [
                      "metadata",
                      "version"
                    ],
                    "additionalProperties": false
                  }
                },
                "assessment": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "subject": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionTitle": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "testQuestions": {
                      "minItems": 1,
                      "maxItems": 100,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "question": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "choices": {
                            "minItems": 2,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "value": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 400
                                }
                              },
                              "required": [
                                "value"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "answer": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          },
                          "correctResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "incorrectResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          }
                        },
                        "required": [
                          "question",
                          "choices",
                          "answer",
                          "correctResponse",
                          "incorrectResponse"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "name",
                    "subject",
                    "level",
                    "testQuestions"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "sectionId",
                "name",
                "summary",
                "level",
                "pages",
                "labs",
                "assessment"
              ],
              "additionalProperties": false
            },
            "preparationId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "required": [
            "requestId",
            "draft"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "get_publishing_run",
        "description": "Inspect a publishing receipt owned by the authenticated administrator.",
        "annotations": {
          "readOnlyHint": true,
          "destructiveHint": false,
          "idempotentHint": true,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "requestId": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            }
          },
          "required": [
            "requestId"
          ],
          "additionalProperties": false
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "manage_document",
        "description": "Admin document/workshop CRUD through service-document.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": true,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "sections"
                }
              },
              "required": [
                "operation"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "workshops"
                },
                "sectionId": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                }
              },
              "required": [
                "operation",
                "sectionId"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "read_page"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "create_workshop"
                },
                "sectionId": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                },
                "summary": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                },
                "level": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 20
                }
              },
              "required": [
                "operation",
                "sectionId",
                "name",
                "summary",
                "level"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "update_workshop"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                },
                "summary": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                },
                "level": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 20
                }
              },
              "required": [
                "operation",
                "id",
                "name",
                "summary",
                "level"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "delete_workshop"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "create_page"
                },
                "workshopId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                },
                "blocks": {
                  "minItems": 1,
                  "maxItems": 200,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "blockId": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 120
                      },
                      "sortIndex": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 9007199254740991
                      },
                      "componentInstanceName": {
                        "type": "string",
                        "enum": [
                          "HeaderBlockComponent",
                          "ParagraphBlockComponent",
                          "NgxEditorJs2BlockquotesComponent",
                          "NgxEditorJs2PanelComponent",
                          "NgxEditorJs2ImageComponent",
                          "NgxEditorJs2CodemirrorComponent",
                          "NgxEditorJs2MermaidjsComponent",
                          "NgxEditorJs2PopQuizComponent"
                        ]
                      },
                      "savedAction": {
                        "type": "string",
                        "maxLength": 120
                      },
                      "dataClean": {
                        "type": "string",
                        "maxLength": 100000
                      }
                    },
                    "required": [
                      "blockId",
                      "sortIndex",
                      "componentInstanceName",
                      "savedAction",
                      "dataClean"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "operation",
                "workshopId",
                "name",
                "blocks"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "update_page"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "blocks": {
                  "minItems": 1,
                  "maxItems": 200,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "blockId": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 120
                      },
                      "sortIndex": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 9007199254740991
                      },
                      "componentInstanceName": {
                        "type": "string",
                        "enum": [
                          "HeaderBlockComponent",
                          "ParagraphBlockComponent",
                          "NgxEditorJs2BlockquotesComponent",
                          "NgxEditorJs2PanelComponent",
                          "NgxEditorJs2ImageComponent",
                          "NgxEditorJs2CodemirrorComponent",
                          "NgxEditorJs2MermaidjsComponent",
                          "NgxEditorJs2PopQuizComponent"
                        ]
                      },
                      "savedAction": {
                        "type": "string",
                        "maxLength": 120
                      },
                      "dataClean": {
                        "type": "string",
                        "maxLength": 100000
                      }
                    },
                    "required": [
                      "blockId",
                      "sortIndex",
                      "componentInstanceName",
                      "savedAction",
                      "dataClean"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "operation",
                "id",
                "blocks"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "rename_page"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "workshopId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                }
              },
              "required": [
                "operation",
                "id",
                "workshopId",
                "name"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "delete_page"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "workshopId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                }
              },
              "required": [
                "operation",
                "id",
                "workshopId",
                "name"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "add_reference"
                },
                "workshopId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "kind": {
                  "type": "string",
                  "enum": [
                    "CODING_LAB",
                    "ASSESSMENT_TEST"
                  ]
                },
                "resourceId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 160
                }
              },
              "required": [
                "operation",
                "workshopId",
                "kind",
                "resourceId",
                "name"
              ],
              "additionalProperties": false
            }
          ]
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "manage_assessment",
        "description": "Admin assessment CRUD including answers; never expose through catalog endpoint.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": true,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "list"
                }
              },
              "required": [
                "operation"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "read"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "create"
                },
                "assessment": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "subject": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionTitle": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "testQuestions": {
                      "minItems": 1,
                      "maxItems": 100,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "question": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "choices": {
                            "minItems": 2,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "value": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 400
                                }
                              },
                              "required": [
                                "value"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "answer": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          },
                          "correctResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "incorrectResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          }
                        },
                        "required": [
                          "question",
                          "choices",
                          "answer",
                          "correctResponse",
                          "incorrectResponse"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "name",
                    "subject",
                    "level",
                    "testQuestions"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "assessment"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "update"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 9007199254740991
                },
                "assessment": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "subject": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "sectionTitle": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 120
                    },
                    "level": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 20
                    },
                    "testQuestions": {
                      "minItems": 1,
                      "maxItems": 100,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "question": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "choices": {
                            "minItems": 2,
                            "maxItems": 10,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "value": {
                                  "type": "string",
                                  "minLength": 1,
                                  "maxLength": 400
                                }
                              },
                              "required": [
                                "value"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "answer": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 400
                          },
                          "correctResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          },
                          "incorrectResponse": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 1000
                          }
                        },
                        "required": [
                          "question",
                          "choices",
                          "answer",
                          "correctResponse",
                          "incorrectResponse"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "name",
                    "subject",
                    "level",
                    "testQuestions"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "id",
                "version",
                "assessment"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "delete"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            }
          ]
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "manage_coding_lab",
        "description": "Admin lab CRUD/version verification/publication. Delete archives a lab.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": true,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "list"
                }
              },
              "required": [
                "operation"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "read"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "create"
                },
                "workshopId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "metadata": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "slug": {
                      "type": "string",
                      "maxLength": 200,
                      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    },
                    "summary": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "difficulty": {
                      "type": "string",
                      "enum": [
                        "intro",
                        "easy",
                        "medium",
                        "hard"
                      ]
                    }
                  },
                  "required": [
                    "title",
                    "slug",
                    "summary",
                    "difficulty"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "workshopId",
                "metadata"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "update"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "metadata": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 160
                    },
                    "slug": {
                      "type": "string",
                      "maxLength": 200,
                      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    },
                    "summary": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "difficulty": {
                      "type": "string",
                      "enum": [
                        "intro",
                        "easy",
                        "medium",
                        "hard"
                      ]
                    }
                  },
                  "required": [
                    "title",
                    "slug",
                    "summary",
                    "difficulty"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "id",
                "metadata"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "delete"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "versions"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "read_version"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "versionId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id",
                "versionId"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "create_version"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "version": {
                  "type": "object",
                  "properties": {
                    "language": {
                      "type": "string",
                      "enum": [
                        "javascript",
                        "typescript"
                      ]
                    },
                    "promptMarkdown": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "hints": {
                      "maxItems": 30,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 20000
                      }
                    },
                    "starterCode": {
                      "type": "string",
                      "maxLength": 50000
                    },
                    "referenceSolution": {
                      "type": "object",
                      "properties": {
                        "code": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 50000
                        }
                      },
                      "required": [
                        "code"
                      ],
                      "additionalProperties": false
                    },
                    "sampleTests": {
                      "minItems": 1,
                      "maxItems": 50,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "maxLength": 2000
                          },
                          "kind": {
                            "type": "string",
                            "enum": [
                              "io",
                              "unit"
                            ]
                          },
                          "input": {},
                          "expected": {},
                          "comparator": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "enum": [
                                  "deepEqual",
                                  "strictEqual",
                                  "numberTolerance",
                                  "stringNormalized",
                                  "custom"
                                ]
                              },
                              "tolerance": {
                                "type": "number"
                              },
                              "normalizeWhitespace": {
                                "type": "boolean"
                              },
                              "ignoreCase": {
                                "type": "boolean"
                              },
                              "customComparatorId": {
                                "type": "string"
                              }
                            },
                            "required": [
                              "kind"
                            ],
                            "additionalProperties": false
                          },
                          "testCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "framework": {
                            "type": "string",
                            "enum": [
                              "jest",
                              "vitest"
                            ]
                          }
                        },
                        "required": [
                          "name",
                          "kind"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "hiddenTests": {
                      "minItems": 1,
                      "maxItems": 50,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "maxLength": 2000
                          },
                          "kind": {
                            "type": "string",
                            "enum": [
                              "io",
                              "unit"
                            ]
                          },
                          "input": {},
                          "expected": {},
                          "comparator": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "enum": [
                                  "deepEqual",
                                  "strictEqual",
                                  "numberTolerance",
                                  "stringNormalized",
                                  "custom"
                                ]
                              },
                              "tolerance": {
                                "type": "number"
                              },
                              "normalizeWhitespace": {
                                "type": "boolean"
                              },
                              "ignoreCase": {
                                "type": "boolean"
                              },
                              "customComparatorId": {
                                "type": "string"
                              }
                            },
                            "required": [
                              "kind"
                            ],
                            "additionalProperties": false
                          },
                          "testCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "framework": {
                            "type": "string",
                            "enum": [
                              "jest",
                              "vitest"
                            ]
                          }
                        },
                        "required": [
                          "name",
                          "kind"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "runner": {
                      "type": "object",
                      "properties": {
                        "timeoutMs": {
                          "type": "integer",
                          "minimum": 100,
                          "maximum": 10000
                        },
                        "entryFnName": {
                          "type": "string",
                          "pattern": "^[a-zA-Z_$][\\w$]*$"
                        }
                      },
                      "required": [
                        "timeoutMs",
                        "entryFnName"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "language",
                    "promptMarkdown",
                    "hints",
                    "starterCode",
                    "referenceSolution",
                    "sampleTests",
                    "hiddenTests",
                    "runner"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "id",
                "version"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "update_version"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "versionId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "expectedContentHash": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                },
                "version": {
                  "type": "object",
                  "properties": {
                    "language": {
                      "type": "string",
                      "enum": [
                        "javascript",
                        "typescript"
                      ]
                    },
                    "promptMarkdown": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 20000
                    },
                    "hints": {
                      "maxItems": 30,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 20000
                      }
                    },
                    "starterCode": {
                      "type": "string",
                      "maxLength": 50000
                    },
                    "referenceSolution": {
                      "type": "object",
                      "properties": {
                        "code": {
                          "type": "string",
                          "minLength": 1,
                          "maxLength": 50000
                        }
                      },
                      "required": [
                        "code"
                      ],
                      "additionalProperties": false
                    },
                    "sampleTests": {
                      "minItems": 1,
                      "maxItems": 50,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "maxLength": 2000
                          },
                          "kind": {
                            "type": "string",
                            "enum": [
                              "io",
                              "unit"
                            ]
                          },
                          "input": {},
                          "expected": {},
                          "comparator": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "enum": [
                                  "deepEqual",
                                  "strictEqual",
                                  "numberTolerance",
                                  "stringNormalized",
                                  "custom"
                                ]
                              },
                              "tolerance": {
                                "type": "number"
                              },
                              "normalizeWhitespace": {
                                "type": "boolean"
                              },
                              "ignoreCase": {
                                "type": "boolean"
                              },
                              "customComparatorId": {
                                "type": "string"
                              }
                            },
                            "required": [
                              "kind"
                            ],
                            "additionalProperties": false
                          },
                          "testCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "framework": {
                            "type": "string",
                            "enum": [
                              "jest",
                              "vitest"
                            ]
                          }
                        },
                        "required": [
                          "name",
                          "kind"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "hiddenTests": {
                      "minItems": 1,
                      "maxItems": 50,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "maxLength": 2000
                          },
                          "kind": {
                            "type": "string",
                            "enum": [
                              "io",
                              "unit"
                            ]
                          },
                          "input": {},
                          "expected": {},
                          "comparator": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "enum": [
                                  "deepEqual",
                                  "strictEqual",
                                  "numberTolerance",
                                  "stringNormalized",
                                  "custom"
                                ]
                              },
                              "tolerance": {
                                "type": "number"
                              },
                              "normalizeWhitespace": {
                                "type": "boolean"
                              },
                              "ignoreCase": {
                                "type": "boolean"
                              },
                              "customComparatorId": {
                                "type": "string"
                              }
                            },
                            "required": [
                              "kind"
                            ],
                            "additionalProperties": false
                          },
                          "testCode": {
                            "type": "string",
                            "maxLength": 50000
                          },
                          "framework": {
                            "type": "string",
                            "enum": [
                              "jest",
                              "vitest"
                            ]
                          }
                        },
                        "required": [
                          "name",
                          "kind"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "runner": {
                      "type": "object",
                      "properties": {
                        "timeoutMs": {
                          "type": "integer",
                          "minimum": 100,
                          "maximum": 10000
                        },
                        "entryFnName": {
                          "type": "string",
                          "pattern": "^[a-zA-Z_$][\\w$]*$"
                        }
                      },
                      "required": [
                        "timeoutMs",
                        "entryFnName"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "language",
                    "promptMarkdown",
                    "hints",
                    "starterCode",
                    "referenceSolution",
                    "sampleTests",
                    "hiddenTests",
                    "runner"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "operation",
                "id",
                "versionId",
                "expectedContentHash",
                "version"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "verify"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "versionId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                }
              },
              "required": [
                "operation",
                "id",
                "versionId"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "publish"
                },
                "id": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "versionId": {
                  "type": "string",
                  "pattern": "^[a-f\\d]{24}$"
                },
                "expectedContentHash": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20000
                }
              },
              "required": [
                "operation",
                "id",
                "versionId",
                "expectedContentHash"
              ],
              "additionalProperties": false
            }
          ]
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      },
      {
        "name": "workshop_image",
        "description": "Find ready image assets, generate and upload a workshop image using server model credentials, or upload base64 bytes. Use returned storageUrl in image dataClean JSON.",
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": true,
          "idempotentHint": false,
          "openWorldHint": true
        },
        "inputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "find"
                },
                "query": {
                  "type": "string",
                  "maxLength": 120
                }
              },
              "required": [
                "operation",
                "query"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "generate"
                },
                "prompt": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 4000
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                }
              },
              "required": [
                "operation",
                "prompt",
                "name"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "operation": {
                  "type": "string",
                  "const": "upload"
                },
                "name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 120
                },
                "mediaType": {
                  "type": "string",
                  "enum": [
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                    "image/gif"
                  ]
                },
                "base64": {
                  "type": "string",
                  "minLength": 4,
                  "maxLength": 6291456,
                  "pattern": "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
                }
              },
              "required": [
                "operation",
                "name",
                "mediaType",
                "base64"
              ],
              "additionalProperties": false
            }
          ]
        },
        "outputSchema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {}
          },
          "required": [
            "data"
          ],
          "additionalProperties": false
        }
      }
    ]
  }
} as const;
export const publisherSchemas = {"SavedWorkshopDraft":{"type":"object","properties":{"draftId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"version":{"type":"integer","minimum":0,"exclusiveMinimum":true,"maximum":9007199254740991},"name":{"type":"string","maxLength":160},"json":{"type":"string","maxLength":6000000},"status":{"type":"string","enum":["running","interrupted","ready","needs_attention","edited","published"]},"brief":{"type":"object","properties":{"brief":{"type":"string","minLength":1,"maxLength":20000},"model":{"type":"string","minLength":1,"maxLength":120},"sectionId":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20}},"required":["brief","sectionId","level"],"additionalProperties":false},"previousPreparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"publishedRequestId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"createdAt":{"type":"string"},"updatedAt":{"type":"string"}},"required":["draftId","version","name","json","status","createdAt","updatedAt"],"additionalProperties":false},"WorkshopDraftSummary":{"type":"object","properties":{"draftId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"version":{"type":"integer","minimum":0,"exclusiveMinimum":true,"maximum":9007199254740991},"name":{"type":"string","maxLength":160},"status":{"type":"string","enum":["running","interrupted","ready","needs_attention","edited","published"]},"previousPreparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"publishedRequestId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"createdAt":{"type":"string"},"updatedAt":{"type":"string"}},"required":["draftId","version","name","status","createdAt","updatedAt"],"additionalProperties":false},"PreparationReport":{"type":"object","properties":{"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"status":{"type":"string","enum":["running","complete","failed"]},"ready":{"type":"boolean"},"createdAt":{"type":"string"},"updatedAt":{"type":"string"},"activities":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"kind":{"type":"string","enum":["skill","generation","check","review","repair"]},"status":{"type":"string","enum":["pending","running","passed","failed","skipped","review_required"]},"detail":{"type":"string","maxLength":4000},"startedAt":{"type":"string"},"finishedAt":{"type":"string"},"skillVersion":{"type":"string"},"skillHash":{"type":"string"}},"required":["id","label","kind","status","detail"],"additionalProperties":false}},"repairCount":{"type":"integer","minimum":0,"maximum":1},"model":{"type":"string"},"draft":{"type":"object","properties":{"learningPlan":{"type":"object","properties":{"prerequisites":{"maxItems":20,"type":"array","items":{"type":"string","minLength":1,"maxLength":400}},"objectives":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"objective":{"type":"string","minLength":1,"maxLength":600},"pageIndexes":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"labIndexes":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"questionIndexes":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}}},"required":["objective","pageIndexes","labIndexes","questionIndexes"],"additionalProperties":false}}},"required":["prerequisites","objectives"],"additionalProperties":false},"sectionId":{"type":"string","minLength":1,"maxLength":120},"name":{"type":"string","minLength":1,"maxLength":160},"summary":{"type":"string","minLength":1,"maxLength":20000},"level":{"type":"integer","minimum":1,"maximum":20},"pages":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"blocks":{"minItems":1,"maxItems":200,"type":"array","items":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false}}},"required":["name","blocks"],"additionalProperties":false}},"labs":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"object","properties":{"metadata":{"type":"object","properties":{"title":{"type":"string","minLength":1,"maxLength":160},"slug":{"type":"string","maxLength":200,"pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"summary":{"type":"string","minLength":1,"maxLength":20000},"difficulty":{"type":"string","enum":["intro","easy","medium","hard"]}},"required":["title","slug","summary","difficulty"],"additionalProperties":false},"version":{"type":"object","properties":{"language":{"type":"string","enum":["javascript","typescript"]},"promptMarkdown":{"type":"string","minLength":1,"maxLength":20000},"hints":{"maxItems":30,"type":"array","items":{"type":"string","minLength":1,"maxLength":20000}},"starterCode":{"type":"string","maxLength":50000},"referenceSolution":{"type":"object","properties":{"code":{"type":"string","minLength":1,"maxLength":50000}},"required":["code"],"additionalProperties":false},"sampleTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"hiddenTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"runner":{"type":"object","properties":{"timeoutMs":{"type":"integer","minimum":100,"maximum":10000},"entryFnName":{"type":"string","pattern":"^[a-zA-Z_$][\\w$]*$"}},"required":["timeoutMs","entryFnName"],"additionalProperties":false}},"required":["language","promptMarkdown","hints","starterCode","referenceSolution","sampleTests","hiddenTests","runner"],"additionalProperties":false}},"required":["metadata","version"],"additionalProperties":false}},"assessment":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"subject":{"type":"string","minLength":1,"maxLength":120},"sectionTitle":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20},"testQuestions":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"object","properties":{"question":{"type":"string","minLength":1,"maxLength":1000},"choices":{"minItems":2,"maxItems":10,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","minLength":1,"maxLength":400}},"required":["value"],"additionalProperties":false}},"answer":{"type":"string","minLength":1,"maxLength":400},"correctResponse":{"type":"string","minLength":1,"maxLength":1000},"incorrectResponse":{"type":"string","minLength":1,"maxLength":1000}},"required":["question","choices","answer","correctResponse","incorrectResponse"],"additionalProperties":false}}},"required":["name","subject","level","testQuestions"],"additionalProperties":false}},"required":["sectionId","name","summary","level","pages","labs","assessment"],"additionalProperties":false},"draftHash":{"type":"string"},"message":{"type":"string"}},"required":["preparationId","status","ready","createdAt","updatedAt","activities","repairCount"],"additionalProperties":false},"PreparationRepairOptions":{"type":"object","properties":{"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftHash":{"type":"string","pattern":"^[a-f0-9]{64}$"},"model":{"nullable":true,"type":"string"},"activities":{"maxItems":100,"type":"array","items":{"type":"object","properties":{"activityId":{"type":"string"},"label":{"type":"string"}},"required":["activityId","label"],"additionalProperties":false}}},"required":["preparationId","model","activities"],"additionalProperties":false},"PreparationActivity":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"kind":{"type":"string","enum":["skill","generation","check","review","repair"]},"status":{"type":"string","enum":["pending","running","passed","failed","skipped","review_required"]},"detail":{"type":"string","maxLength":4000},"startedAt":{"type":"string"},"finishedAt":{"type":"string"},"skillVersion":{"type":"string"},"skillHash":{"type":"string"}},"required":["id","label","kind","status","detail"],"additionalProperties":false},"StartWorkshopPreparationInput":{"oneOf":[{"type":"object","properties":{"operation":{"type":"string","enum":["generate"]},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftVersion":{"type":"integer","minimum":0,"exclusiveMinimum":true,"maximum":9007199254740991},"input":{"type":"object","properties":{"brief":{"type":"string","minLength":1,"maxLength":20000},"model":{"type":"string","minLength":1,"maxLength":120},"sectionId":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20}},"required":["brief","sectionId","level"],"additionalProperties":false}},"required":["operation","input"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["check"]},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftVersion":{"type":"integer","minimum":0,"exclusiveMinimum":true,"maximum":9007199254740991},"draft":{}},"required":["operation","draft"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["repair"]},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draftVersion":{"type":"integer","minimum":0,"exclusiveMinimum":true,"maximum":9007199254740991},"sourcePreparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"expectedDraftHash":{"type":"string","pattern":"^[a-f0-9]{64}$"},"activityId":{"type":"string","minLength":1,"maxLength":200},"model":{"type":"string","minLength":1,"maxLength":120}},"required":["operation","sourcePreparationId","expectedDraftHash","activityId"],"additionalProperties":false}]},"LearningPlan":{"type":"object","properties":{"prerequisites":{"maxItems":20,"type":"array","items":{"type":"string","minLength":1,"maxLength":400}},"objectives":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"objective":{"type":"string","minLength":1,"maxLength":600},"pageIndexes":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"labIndexes":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"questionIndexes":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}}},"required":["objective","pageIndexes","labIndexes","questionIndexes"],"additionalProperties":false}}},"required":["prerequisites","objectives"],"additionalProperties":false},"PublishingModelCatalog":{"type":"object","properties":{"models":{"maxItems":50,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":120},"inputUsdPerMillion":{"nullable":true,"type":"number","minimum":0},"outputUsdPerMillion":{"nullable":true,"type":"number","minimum":0}},"required":["id","inputUsdPerMillion","outputUsdPerMillion"],"additionalProperties":false}},"defaultModel":{"nullable":true,"type":"string"},"imageModel":{"type":"string"}},"required":["models","defaultModel","imageModel"],"additionalProperties":false},"PublishingModel":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":120},"inputUsdPerMillion":{"nullable":true,"type":"number","minimum":0},"outputUsdPerMillion":{"nullable":true,"type":"number","minimum":0}},"required":["id","inputUsdPerMillion","outputUsdPerMillion"],"additionalProperties":false},"WorkshopDraft":{"type":"object","properties":{"learningPlan":{"type":"object","properties":{"prerequisites":{"maxItems":20,"type":"array","items":{"type":"string","minLength":1,"maxLength":400}},"objectives":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"objective":{"type":"string","minLength":1,"maxLength":600},"pageIndexes":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"labIndexes":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"questionIndexes":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}}},"required":["objective","pageIndexes","labIndexes","questionIndexes"],"additionalProperties":false}}},"required":["prerequisites","objectives"],"additionalProperties":false},"sectionId":{"type":"string","minLength":1,"maxLength":120},"name":{"type":"string","minLength":1,"maxLength":160},"summary":{"type":"string","minLength":1,"maxLength":20000},"level":{"type":"integer","minimum":1,"maximum":20},"pages":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"blocks":{"minItems":1,"maxItems":200,"type":"array","items":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false}}},"required":["name","blocks"],"additionalProperties":false}},"labs":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"object","properties":{"metadata":{"type":"object","properties":{"title":{"type":"string","minLength":1,"maxLength":160},"slug":{"type":"string","maxLength":200,"pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"summary":{"type":"string","minLength":1,"maxLength":20000},"difficulty":{"type":"string","enum":["intro","easy","medium","hard"]}},"required":["title","slug","summary","difficulty"],"additionalProperties":false},"version":{"type":"object","properties":{"language":{"type":"string","enum":["javascript","typescript"]},"promptMarkdown":{"type":"string","minLength":1,"maxLength":20000},"hints":{"maxItems":30,"type":"array","items":{"type":"string","minLength":1,"maxLength":20000}},"starterCode":{"type":"string","maxLength":50000},"referenceSolution":{"type":"object","properties":{"code":{"type":"string","minLength":1,"maxLength":50000}},"required":["code"],"additionalProperties":false},"sampleTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"hiddenTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"runner":{"type":"object","properties":{"timeoutMs":{"type":"integer","minimum":100,"maximum":10000},"entryFnName":{"type":"string","pattern":"^[a-zA-Z_$][\\w$]*$"}},"required":["timeoutMs","entryFnName"],"additionalProperties":false}},"required":["language","promptMarkdown","hints","starterCode","referenceSolution","sampleTests","hiddenTests","runner"],"additionalProperties":false}},"required":["metadata","version"],"additionalProperties":false}},"assessment":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"subject":{"type":"string","minLength":1,"maxLength":120},"sectionTitle":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20},"testQuestions":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"object","properties":{"question":{"type":"string","minLength":1,"maxLength":1000},"choices":{"minItems":2,"maxItems":10,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","minLength":1,"maxLength":400}},"required":["value"],"additionalProperties":false}},"answer":{"type":"string","minLength":1,"maxLength":400},"correctResponse":{"type":"string","minLength":1,"maxLength":1000},"incorrectResponse":{"type":"string","minLength":1,"maxLength":1000}},"required":["question","choices","answer","correctResponse","incorrectResponse"],"additionalProperties":false}}},"required":["name","subject","level","testQuestions"],"additionalProperties":false}},"required":["sectionId","name","summary","level","pages","labs","assessment"],"additionalProperties":false},"PublishingReceipt":{"type":"object","properties":{"requestId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"subject":{"type":"string"},"draftHash":{"type":"string"},"status":{"type":"string","enum":["running","complete","needs_recovery"]},"steps":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"status":{"type":"string","enum":["pending","complete"]},"result":{}},"required":["name","status"],"additionalProperties":false}},"message":{"type":"string"},"preparation":{"type":"object","properties":{"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"status":{"type":"string","enum":["running","complete","failed"]},"ready":{"type":"boolean"},"createdAt":{"type":"string"},"updatedAt":{"type":"string"},"activities":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"label":{"type":"string"},"kind":{"type":"string","enum":["skill","generation","check","review","repair"]},"status":{"type":"string","enum":["pending","running","passed","failed","skipped","review_required"]},"detail":{"type":"string","maxLength":4000},"startedAt":{"type":"string"},"finishedAt":{"type":"string"},"skillVersion":{"type":"string"},"skillHash":{"type":"string"}},"required":["id","label","kind","status","detail"],"additionalProperties":false}},"repairCount":{"type":"integer","minimum":0,"maximum":1},"model":{"type":"string"},"draftHash":{"type":"string"},"message":{"type":"string"}},"required":["preparationId","status","ready","createdAt","updatedAt","activities","repairCount"],"additionalProperties":false}},"required":["requestId","subject","draftHash","status","steps"],"additionalProperties":false},"ManageDocumentInput":{"oneOf":[{"type":"object","properties":{"operation":{"type":"string","enum":["sections"]}},"required":["operation"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["workshops"]},"sectionId":{"type":"string","minLength":1,"maxLength":120}},"required":["operation","sectionId"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["read_page"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["create_workshop"]},"sectionId":{"type":"string","minLength":1,"maxLength":120},"name":{"type":"string","minLength":1,"maxLength":160},"summary":{"type":"string","minLength":1,"maxLength":20000},"level":{"type":"integer","minimum":1,"maximum":20}},"required":["operation","sectionId","name","summary","level"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["update_workshop"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"name":{"type":"string","minLength":1,"maxLength":160},"summary":{"type":"string","minLength":1,"maxLength":20000},"level":{"type":"integer","minimum":1,"maximum":20}},"required":["operation","id","name","summary","level"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["delete_workshop"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["create_page"]},"workshopId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"name":{"type":"string","minLength":1,"maxLength":160},"blocks":{"minItems":1,"maxItems":200,"type":"array","items":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false}}},"required":["operation","workshopId","name","blocks"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["update_page"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"blocks":{"minItems":1,"maxItems":200,"type":"array","items":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false}}},"required":["operation","id","blocks"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["rename_page"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"workshopId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"name":{"type":"string","minLength":1,"maxLength":160}},"required":["operation","id","workshopId","name"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["delete_page"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"workshopId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"name":{"type":"string","minLength":1,"maxLength":160}},"required":["operation","id","workshopId","name"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["add_reference"]},"workshopId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"kind":{"type":"string","enum":["CODING_LAB","ASSESSMENT_TEST"]},"resourceId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"name":{"type":"string","minLength":1,"maxLength":160}},"required":["operation","workshopId","kind","resourceId","name"],"additionalProperties":false}]},"ManageAssessmentInput":{"oneOf":[{"type":"object","properties":{"operation":{"type":"string","enum":["list"]}},"required":["operation"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["read"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["create"]},"assessment":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"subject":{"type":"string","minLength":1,"maxLength":120},"sectionTitle":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20},"testQuestions":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"object","properties":{"question":{"type":"string","minLength":1,"maxLength":1000},"choices":{"minItems":2,"maxItems":10,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","minLength":1,"maxLength":400}},"required":["value"],"additionalProperties":false}},"answer":{"type":"string","minLength":1,"maxLength":400},"correctResponse":{"type":"string","minLength":1,"maxLength":1000},"incorrectResponse":{"type":"string","minLength":1,"maxLength":1000}},"required":["question","choices","answer","correctResponse","incorrectResponse"],"additionalProperties":false}}},"required":["name","subject","level","testQuestions"],"additionalProperties":false}},"required":["operation","assessment"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["update"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"version":{"type":"integer","minimum":0,"maximum":9007199254740991},"assessment":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"subject":{"type":"string","minLength":1,"maxLength":120},"sectionTitle":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20},"testQuestions":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"object","properties":{"question":{"type":"string","minLength":1,"maxLength":1000},"choices":{"minItems":2,"maxItems":10,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","minLength":1,"maxLength":400}},"required":["value"],"additionalProperties":false}},"answer":{"type":"string","minLength":1,"maxLength":400},"correctResponse":{"type":"string","minLength":1,"maxLength":1000},"incorrectResponse":{"type":"string","minLength":1,"maxLength":1000}},"required":["question","choices","answer","correctResponse","incorrectResponse"],"additionalProperties":false}}},"required":["name","subject","level","testQuestions"],"additionalProperties":false}},"required":["operation","id","version","assessment"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["delete"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false}]},"ManageCodingLabInput":{"oneOf":[{"type":"object","properties":{"operation":{"type":"string","enum":["list"]}},"required":["operation"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["read"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["create"]},"workshopId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"metadata":{"type":"object","properties":{"title":{"type":"string","minLength":1,"maxLength":160},"slug":{"type":"string","maxLength":200,"pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"summary":{"type":"string","minLength":1,"maxLength":20000},"difficulty":{"type":"string","enum":["intro","easy","medium","hard"]}},"required":["title","slug","summary","difficulty"],"additionalProperties":false}},"required":["operation","workshopId","metadata"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["update"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"metadata":{"type":"object","properties":{"title":{"type":"string","minLength":1,"maxLength":160},"slug":{"type":"string","maxLength":200,"pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"summary":{"type":"string","minLength":1,"maxLength":20000},"difficulty":{"type":"string","enum":["intro","easy","medium","hard"]}},"required":["title","slug","summary","difficulty"],"additionalProperties":false}},"required":["operation","id","metadata"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["delete"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["versions"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["read_version"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"versionId":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id","versionId"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["create_version"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"version":{"type":"object","properties":{"language":{"type":"string","enum":["javascript","typescript"]},"promptMarkdown":{"type":"string","minLength":1,"maxLength":20000},"hints":{"maxItems":30,"type":"array","items":{"type":"string","minLength":1,"maxLength":20000}},"starterCode":{"type":"string","maxLength":50000},"referenceSolution":{"type":"object","properties":{"code":{"type":"string","minLength":1,"maxLength":50000}},"required":["code"],"additionalProperties":false},"sampleTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"hiddenTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"runner":{"type":"object","properties":{"timeoutMs":{"type":"integer","minimum":100,"maximum":10000},"entryFnName":{"type":"string","pattern":"^[a-zA-Z_$][\\w$]*$"}},"required":["timeoutMs","entryFnName"],"additionalProperties":false}},"required":["language","promptMarkdown","hints","starterCode","referenceSolution","sampleTests","hiddenTests","runner"],"additionalProperties":false}},"required":["operation","id","version"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["update_version"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"versionId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"expectedContentHash":{"type":"string","minLength":1,"maxLength":20000},"version":{"type":"object","properties":{"language":{"type":"string","enum":["javascript","typescript"]},"promptMarkdown":{"type":"string","minLength":1,"maxLength":20000},"hints":{"maxItems":30,"type":"array","items":{"type":"string","minLength":1,"maxLength":20000}},"starterCode":{"type":"string","maxLength":50000},"referenceSolution":{"type":"object","properties":{"code":{"type":"string","minLength":1,"maxLength":50000}},"required":["code"],"additionalProperties":false},"sampleTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"hiddenTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"runner":{"type":"object","properties":{"timeoutMs":{"type":"integer","minimum":100,"maximum":10000},"entryFnName":{"type":"string","pattern":"^[a-zA-Z_$][\\w$]*$"}},"required":["timeoutMs","entryFnName"],"additionalProperties":false}},"required":["language","promptMarkdown","hints","starterCode","referenceSolution","sampleTests","hiddenTests","runner"],"additionalProperties":false}},"required":["operation","id","versionId","expectedContentHash","version"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["verify"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"versionId":{"type":"string","pattern":"^[a-f\\d]{24}$"}},"required":["operation","id","versionId"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["publish"]},"id":{"type":"string","pattern":"^[a-f\\d]{24}$"},"versionId":{"type":"string","pattern":"^[a-f\\d]{24}$"},"expectedContentHash":{"type":"string","minLength":1,"maxLength":20000}},"required":["operation","id","versionId","expectedContentHash"],"additionalProperties":false}]},"WorkshopImageInput":{"oneOf":[{"type":"object","properties":{"operation":{"type":"string","enum":["find"]},"query":{"type":"string","maxLength":120}},"required":["operation","query"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["generate"]},"prompt":{"type":"string","minLength":1,"maxLength":4000},"name":{"type":"string","minLength":1,"maxLength":120}},"required":["operation","prompt","name"],"additionalProperties":false},{"type":"object","properties":{"operation":{"type":"string","enum":["upload"]},"name":{"type":"string","minLength":1,"maxLength":120},"mediaType":{"type":"string","enum":["image/png","image/jpeg","image/webp","image/gif"]},"base64":{"type":"string","minLength":4,"maxLength":6291456,"pattern":"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"}},"required":["operation","name","mediaType","base64"],"additionalProperties":false}]},"EditorBlock":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false},"PublishingResult":{"type":"object","properties":{"data":{}},"required":["data"],"additionalProperties":false},"GenerateWorkshopDraftInput":{"type":"object","properties":{"brief":{"type":"string","minLength":1,"maxLength":20000},"model":{"type":"string","minLength":1,"maxLength":120},"sectionId":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20}},"required":["brief","sectionId","level"],"additionalProperties":false},"PublishWorkshopInput":{"type":"object","properties":{"requestId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"draft":{"type":"object","properties":{"learningPlan":{"type":"object","properties":{"prerequisites":{"maxItems":20,"type":"array","items":{"type":"string","minLength":1,"maxLength":400}},"objectives":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"objective":{"type":"string","minLength":1,"maxLength":600},"pageIndexes":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"labIndexes":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}},"questionIndexes":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"integer","minimum":0,"maximum":9007199254740991}}},"required":["objective","pageIndexes","labIndexes","questionIndexes"],"additionalProperties":false}}},"required":["prerequisites","objectives"],"additionalProperties":false},"sectionId":{"type":"string","minLength":1,"maxLength":120},"name":{"type":"string","minLength":1,"maxLength":160},"summary":{"type":"string","minLength":1,"maxLength":20000},"level":{"type":"integer","minimum":1,"maximum":20},"pages":{"minItems":1,"maxItems":20,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"blocks":{"minItems":1,"maxItems":200,"type":"array","items":{"type":"object","properties":{"blockId":{"type":"string","minLength":1,"maxLength":120},"sortIndex":{"type":"integer","minimum":0,"maximum":9007199254740991},"componentInstanceName":{"type":"string","enum":["HeaderBlockComponent","ParagraphBlockComponent","NgxEditorJs2BlockquotesComponent","NgxEditorJs2PanelComponent","NgxEditorJs2ImageComponent","NgxEditorJs2CodemirrorComponent","NgxEditorJs2MermaidjsComponent","NgxEditorJs2PopQuizComponent"]},"savedAction":{"type":"string","maxLength":120},"dataClean":{"type":"string","maxLength":100000}},"required":["blockId","sortIndex","componentInstanceName","savedAction","dataClean"],"additionalProperties":false}}},"required":["name","blocks"],"additionalProperties":false}},"labs":{"minItems":1,"maxItems":10,"type":"array","items":{"type":"object","properties":{"metadata":{"type":"object","properties":{"title":{"type":"string","minLength":1,"maxLength":160},"slug":{"type":"string","maxLength":200,"pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"summary":{"type":"string","minLength":1,"maxLength":20000},"difficulty":{"type":"string","enum":["intro","easy","medium","hard"]}},"required":["title","slug","summary","difficulty"],"additionalProperties":false},"version":{"type":"object","properties":{"language":{"type":"string","enum":["javascript","typescript"]},"promptMarkdown":{"type":"string","minLength":1,"maxLength":20000},"hints":{"maxItems":30,"type":"array","items":{"type":"string","minLength":1,"maxLength":20000}},"starterCode":{"type":"string","maxLength":50000},"referenceSolution":{"type":"object","properties":{"code":{"type":"string","minLength":1,"maxLength":50000}},"required":["code"],"additionalProperties":false},"sampleTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"hiddenTests":{"minItems":1,"maxItems":50,"type":"array","items":{"type":"object","properties":{"name":{"type":"string","maxLength":2000},"kind":{"type":"string","enum":["io","unit"]},"input":{},"expected":{},"comparator":{"type":"object","properties":{"kind":{"type":"string","enum":["deepEqual","strictEqual","numberTolerance","stringNormalized","custom"]},"tolerance":{"type":"number"},"normalizeWhitespace":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"customComparatorId":{"type":"string"}},"required":["kind"],"additionalProperties":false},"testCode":{"type":"string","maxLength":50000},"framework":{"type":"string","enum":["jest","vitest"]}},"required":["name","kind"],"additionalProperties":false}},"runner":{"type":"object","properties":{"timeoutMs":{"type":"integer","minimum":100,"maximum":10000},"entryFnName":{"type":"string","pattern":"^[a-zA-Z_$][\\w$]*$"}},"required":["timeoutMs","entryFnName"],"additionalProperties":false}},"required":["language","promptMarkdown","hints","starterCode","referenceSolution","sampleTests","hiddenTests","runner"],"additionalProperties":false}},"required":["metadata","version"],"additionalProperties":false}},"assessment":{"type":"object","properties":{"name":{"type":"string","minLength":1,"maxLength":160},"subject":{"type":"string","minLength":1,"maxLength":120},"sectionTitle":{"type":"string","minLength":1,"maxLength":120},"level":{"type":"integer","minimum":1,"maximum":20},"testQuestions":{"minItems":1,"maxItems":100,"type":"array","items":{"type":"object","properties":{"question":{"type":"string","minLength":1,"maxLength":1000},"choices":{"minItems":2,"maxItems":10,"type":"array","items":{"type":"object","properties":{"value":{"type":"string","minLength":1,"maxLength":400}},"required":["value"],"additionalProperties":false}},"answer":{"type":"string","minLength":1,"maxLength":400},"correctResponse":{"type":"string","minLength":1,"maxLength":1000},"incorrectResponse":{"type":"string","minLength":1,"maxLength":1000}},"required":["question","choices","answer","correctResponse","incorrectResponse"],"additionalProperties":false}}},"required":["name","subject","level","testQuestions"],"additionalProperties":false}},"required":["sectionId","name","summary","level","pages","labs","assessment"],"additionalProperties":false},"preparationId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"}},"required":["requestId","draft"],"additionalProperties":false}} as const;
