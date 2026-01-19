"""Config flow for Tile Tracker integration.

Copyright (c) 2024-2026 Jeff Hamm <jeff.hamm@gmail.com>
Developed with assistance from Claude (Anthropic)

SPDX-License-Identifier: MIT
"""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_EMAIL, CONF_PASSWORD
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    DOMAIN,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    CONF_EXCLUDE_DAYS,
    DEFAULT_EXCLUDE_DAYS,
    CONF_EXCLUDE_INVISIBLE,
    DEFAULT_EXCLUDE_INVISIBLE,
)
from .tile_api import TileApiClient

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_EMAIL): str,
        vol.Required(CONF_PASSWORD): str,
    }
)


class TileTrackerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Tile Tracker."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> TileTrackerOptionsFlow:
        """Get the options flow for this handler."""
        return TileTrackerOptionsFlow(config_entry)

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            # Check for existing entry with same email
            await self.async_set_unique_id(user_input[CONF_EMAIL].lower())
            self._abort_if_unique_id_configured()

            # Validate credentials
            session = async_get_clientsession(self.hass)
            client = TileApiClient(
                email=user_input[CONF_EMAIL],
                password=user_input[CONF_PASSWORD],
                session=session,
            )

            try:
                if await client.login():
                    # Test getting tiles
                    tiles = await client.get_tiles()
                    _LOGGER.info("Found %d tiles for account %s", len(tiles), user_input[CONF_EMAIL])
                    
                    return self.async_create_entry(
                        title=user_input[CONF_EMAIL],
                        data=user_input,
                    )
                else:
                    errors["base"] = "invalid_auth"
            except Exception as err:
                _LOGGER.exception("Error during authentication: %s", err)
                errors["base"] = "cannot_connect"

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_DATA_SCHEMA,
            errors=errors,
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> FlowResult:
        """Handle reauthorization."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle reauthorization confirmation."""
        errors: dict[str, str] = {}

        if user_input is not None:
            entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
            if entry:
                session = async_get_clientsession(self.hass)
                client = TileApiClient(
                    email=entry.data[CONF_EMAIL],
                    password=user_input[CONF_PASSWORD],
                    session=session,
                )

                try:
                    if await client.login():
                        self.hass.config_entries.async_update_entry(
                            entry,
                            data={
                                **entry.data,
                                CONF_PASSWORD: user_input[CONF_PASSWORD],
                            },
                        )
                        await self.hass.config_entries.async_reload(entry.entry_id)
                        return self.async_abort(reason="reauth_successful")
                    else:
                        errors["base"] = "invalid_auth"
                except Exception as err:
                    _LOGGER.exception("Error during reauthorization: %s", err)
                    errors["base"] = "cannot_connect"

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema({vol.Required(CONF_PASSWORD): str}),
            errors=errors,
        )


class TileTrackerOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for Tile Tracker."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_SCAN_INTERVAL,
                        default=self.config_entry.options.get(
                            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
                        ),
                    ): vol.All(vol.Coerce(int), vol.Range(min=1, max=1440)),
                    vol.Optional(
                        CONF_EXCLUDE_DAYS,
                        default=self.config_entry.options.get(
                            CONF_EXCLUDE_DAYS, DEFAULT_EXCLUDE_DAYS
                        ),
                    ): vol.All(vol.Coerce(int), vol.Range(min=0, max=365)),
                    vol.Optional(
                        CONF_EXCLUDE_INVISIBLE,
                        default=self.config_entry.options.get(
                            CONF_EXCLUDE_INVISIBLE, DEFAULT_EXCLUDE_INVISIBLE
                        ),
                    ): bool,
                }
            ),
        )
