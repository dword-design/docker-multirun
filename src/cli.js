#!/usr/bin/env node

import api from '.'

api().catch(() => process.exit(1))
