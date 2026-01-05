const idl = 
{
  "address": "2oArywYY7xHyoV1xoF9g9QKkyKDHe3rA9kRyu1H8ZQxo",
  "metadata": {
    "name": "landloyalty_presale",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "add_to_whitelist",
      "discriminator": [
        157,
        211,
        52,
        54,
        144,
        81,
        5,
        55
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "presale_state"
          ]
        },
        {
          "name": "whitelist_entry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "user",
          "type": "pubkey"
        },
        {
          "name": "is_vip",
          "type": "bool"
        }
      ]
    },
    {
      "name": "buy_tokens",
      "discriminator": [
        189,
        21,
        230,
        133,
        247,
        2,
        110,
        42
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "whitelist_entry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "buyer_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "buyer_payment_account",
          "writable": true
        },
        {
          "name": "usdc_vault",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "payment_token",
          "type": {
            "defined": {
              "name": "PaymentToken"
            }
          }
        },
        {
          "name": "referrer",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "buy_tokens_vip",
      "discriminator": [
        123,
        86,
        2,
        10,
        132,
        17,
        80,
        48
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "whitelist_entry",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "buyer_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "buyer_payment_account",
          "writable": true
        },
        {
          "name": "usdc_vault",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "payment_token",
          "type": {
            "defined": {
              "name": "PaymentToken"
            }
          }
        }
      ]
    },
    {
      "name": "cancel_presale",
      "discriminator": [
        61,
        164,
        227,
        155,
        193,
        190,
        124,
        19
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "claim_team_tokens",
      "discriminator": [
        137,
        104,
        44,
        247,
        225,
        216,
        99,
        11
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        },
        {
          "name": "token_vault",
          "writable": true
        },
        {
          "name": "team_token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "claim_tokens",
      "discriminator": [
        108,
        216,
        210,
        231,
        0,
        212,
        42,
        64
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyer_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "token_vault",
          "writable": true
        },
        {
          "name": "buyer_token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "end_presale",
      "discriminator": [
        54,
        154,
        35,
        93,
        29,
        58,
        10,
        208
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "extend_presale",
      "discriminator": [
        89,
        101,
        30,
        13,
        38,
        183,
        225,
        198
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": [
        {
          "name": "additional_duration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_mint"
        },
        {
          "name": "usdc_mint"
        },
        {
          "name": "usdt_mint"
        },
        {
          "name": "token_vault",
          "writable": true
        },
        {
          "name": "usdc_vault",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "phase_duration",
          "type": "i64"
        },
        {
          "name": "phase_prices",
          "type": {
            "array": [
              "u64",
              3
            ]
          }
        },
        {
          "name": "max_tokens_per_phase",
          "type": {
            "array": [
              "u64",
              3
            ]
          }
        },
        {
          "name": "vip_price",
          "type": "u64"
        },
        {
          "name": "vip_min_purchase_usd",
          "type": "u64"
        },
        {
          "name": "vip_max_buyers",
          "type": "u64"
        },
        {
          "name": "vip_duration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initialize_team_vesting",
      "discriminator": [
        247,
        77,
        65,
        53,
        191,
        7,
        141,
        195
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "pause",
      "discriminator": [
        211,
        22,
        221,
        251,
        74,
        121,
        193,
        47
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "refund",
      "discriminator": [
        2,
        96,
        183,
        251,
        63,
        208,
        46,
        46
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyer_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "usdc_vault",
          "writable": true
        },
        {
          "name": "buyer_usdc_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "remove_from_whitelist",
      "discriminator": [
        7,
        144,
        216,
        239,
        243,
        236,
        193,
        235
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "presale_state"
          ]
        },
        {
          "name": "whitelist_entry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "_user",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "resume",
      "discriminator": [
        1,
        166,
        51,
        170,
        127,
        32,
        141,
        206
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "withdraw_usdc",
      "discriminator": [
        114,
        49,
        72,
        184,
        27,
        156,
        243,
        155
      ],
      "accounts": [
        {
          "name": "presale_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  101,
                  115,
                  97,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "presale_state"
          ]
        },
        {
          "name": "usdc_vault",
          "writable": true
        },
        {
          "name": "destination",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "BuyerData",
      "discriminator": [
        237,
        107,
        147,
        115,
        15,
        254,
        79,
        234
      ]
    },
    {
      "name": "PresaleState",
      "discriminator": [
        32,
        18,
        85,
        188,
        213,
        180,
        10,
        241
      ]
    },
    {
      "name": "WhitelistEntry",
      "discriminator": [
        51,
        70,
        173,
        81,
        219,
        192,
        234,
        62
      ]
    }
  ],
  "events": [
    {
      "name": "FundsWithdrawn",
      "discriminator": [
        56,
        130,
        230,
        154,
        35,
        92,
        11,
        118
      ]
    },
    {
      "name": "Refunded",
      "discriminator": [
        35,
        103,
        149,
        246,
        196,
        123,
        221,
        99
      ]
    },
    {
      "name": "TokensClaimed",
      "discriminator": [
        25,
        128,
        244,
        55,
        241,
        136,
        200,
        91
      ]
    },
    {
      "name": "TokensPurchased",
      "discriminator": [
        214,
        119,
        105,
        186,
        114,
        205,
        228,
        181
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PresaleEnded",
      "msg": "Presale has ended"
    },
    {
      "code": 6001,
      "name": "PresaleNotStarted",
      "msg": "Presale has not started yet"
    },
    {
      "code": 6002,
      "name": "PresaleNotEnded",
      "msg": "Presale has not ended yet"
    },
    {
      "code": 6003,
      "name": "Paused",
      "msg": "Presale is paused"
    },
    {
      "code": 6004,
      "name": "Cancelled",
      "msg": "Presale is cancelled"
    },
    {
      "code": 6005,
      "name": "PhaseCapacityExceeded",
      "msg": "Phase capacity exceeded"
    },
    {
      "code": 6006,
      "name": "Overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6007,
      "name": "NotWhitelisted",
      "msg": "Not whitelisted"
    },
    {
      "code": 6008,
      "name": "NotVipMember",
      "msg": "Not a VIP member"
    },
    {
      "code": 6009,
      "name": "VipNotStarted",
      "msg": "VIP period has not started"
    },
    {
      "code": 6010,
      "name": "VipPeriodEnded",
      "msg": "VIP period has ended"
    },
    {
      "code": 6011,
      "name": "VipSlotsFull",
      "msg": "All VIP slots are filled"
    },
    {
      "code": 6012,
      "name": "BelowVipMinimum",
      "msg": "Purchase below VIP minimum"
    },
    {
      "code": 6013,
      "name": "NothingToClaim",
      "msg": "Nothing to claim"
    },
    {
      "code": 6014,
      "name": "NothingToRefund",
      "msg": "Nothing to refund"
    },
    {
      "code": 6015,
      "name": "AlreadyRefunded",
      "msg": "Already refunded"
    },
    {
      "code": 6016,
      "name": "RefundNotAllowed",
      "msg": "Refund not allowed (presale not cancelled)"
    },
    {
      "code": 6017,
      "name": "WithdrawalLimitExceeded",
      "msg": "Withdrawal limit exceeded"
    },
    {
      "code": 6018,
      "name": "TeamVestingNotInitialized",
      "msg": "Team vesting not initialized"
    },
    {
      "code": 6019,
      "name": "TeamVestingAlreadyInitialized",
      "msg": "Team vesting already initialized"
    }
  ],
  "types": [
    {
      "name": "BuyerData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "total_purchased",
            "type": "u64"
          },
          {
            "name": "total_paid_usd",
            "type": "u64"
          },
          {
            "name": "total_claimed",
            "type": "u64"
          },
          {
            "name": "bonus_received",
            "type": "u64"
          },
          {
            "name": "is_vip",
            "type": "bool"
          },
          {
            "name": "refunded",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "FundsWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "withdrawn_by",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "PaymentToken",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SOL"
          },
          {
            "name": "USDC"
          },
          {
            "name": "USDT"
          }
        ]
      }
    },
    {
      "name": "PresaleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "token_mint",
            "type": "pubkey"
          },
          {
            "name": "usdc_mint",
            "type": "pubkey"
          },
          {
            "name": "usdt_mint",
            "type": "pubkey"
          },
          {
            "name": "token_vault",
            "type": "pubkey"
          },
          {
            "name": "usdc_vault",
            "type": "pubkey"
          },
          {
            "name": "vip_start_time",
            "type": "i64"
          },
          {
            "name": "vip_price",
            "type": "u64"
          },
          {
            "name": "vip_min_purchase_usd",
            "type": "u64"
          },
          {
            "name": "vip_max_buyers",
            "type": "u64"
          },
          {
            "name": "vip_buyers_count",
            "type": "u64"
          },
          {
            "name": "vip_duration",
            "type": "i64"
          },
          {
            "name": "vip_tokens_sold",
            "type": "u64"
          },
          {
            "name": "start_time",
            "type": "i64"
          },
          {
            "name": "phase_duration",
            "type": "i64"
          },
          {
            "name": "phase_prices",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          },
          {
            "name": "max_tokens_per_phase",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          },
          {
            "name": "tokens_sold",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          },
          {
            "name": "total_raised",
            "type": "u64"
          },
          {
            "name": "total_withdrawn",
            "type": "u64"
          },
          {
            "name": "withdrawal_limit_percentage",
            "type": "u8"
          },
          {
            "name": "team_allocation",
            "type": "u64"
          },
          {
            "name": "team_vesting_start",
            "type": "i64"
          },
          {
            "name": "team_vesting_duration",
            "type": "i64"
          },
          {
            "name": "team_tokens_claimed",
            "type": "u64"
          },
          {
            "name": "is_paused",
            "type": "bool"
          },
          {
            "name": "is_cancelled",
            "type": "bool"
          },
          {
            "name": "presale_ended",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Refunded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TokensClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TokensPurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "cost",
            "type": "u64"
          },
          {
            "name": "phase",
            "type": "u8"
          },
          {
            "name": "is_vip",
            "type": "bool"
          },
          {
            "name": "payment_token",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "WhitelistEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "is_whitelisted",
            "type": "bool"
          },
          {
            "name": "is_vip",
            "type": "bool"
          },
          {
            "name": "total_purchased",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export default idl;
