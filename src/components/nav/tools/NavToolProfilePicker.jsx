import React from 'react'
import {useProfile} from "/src/providers/ProfileProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import OptionPickerButton from "/src/components/buttons/OptionPickerButton.jsx"

function NavToolProfilePicker() {
    const profile = useProfile()
    const language = useLanguage()

    const profiles = profile.getProfiles()
    const activeProfile = profile.getActiveProfile()
    const selectedLocale = language.getSelectedLanguage()?.id || 'fr'

    const tooltipLabel = activeProfile?.locales?.[selectedLocale]?.name
        || activeProfile?.locales?.fr?.name

    const options = profiles.map(p => ({
        id: p.id,
        label: p.locales?.[selectedLocale]?.name || p.locales?.fr?.name,
        faIcon: p.faIcon
    }))

    const _onOptionSelected = (profileId) => {
        profile.setProfile(profileId)
    }

    return (
        <OptionPickerButton mode={OptionPickerButton.Modes.MODE_AUTO}
                            options={options}
                            selectedOptionId={activeProfile?.id}
                            onOptionSelected={_onOptionSelected}
                            tooltipLabel={tooltipLabel}
                            showSelectedOptionOnDropdown={true}/>
    )
}

export default NavToolProfilePicker
