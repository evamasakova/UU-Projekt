const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function callDeleteEndpoint({ path, token }) {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {})
		}
	})

	if (!res.ok) {
		let errorBody = null
		try {
			errorBody = await res.json()
		} catch {
			// odpověď není JSON – ignorujeme
		}

		const message = errorBody?.message || `Request failed with status ${res.status}`
		const error = new Error(message)
		error.status = res.status
		error.body = errorBody
		throw error
	}

	if (res.status === 204) {
		return null
	}

	try {
		return await res.json()
	} catch {
		return null
	}
}

export async function deleteCampaignAsAdmin({ campaignId, token }) {
	if (!campaignId) {
		throw new Error('campaignId is required')
	}

	return callDeleteEndpoint({
		path: `/admin/campaigns/${campaignId}`,
		token
	})
}

export async function deleteOwnCampaign({ campaignId, token }) {
	if (!campaignId) {
		throw new Error('campaignId is required')
	}

	return callDeleteEndpoint({
		path: `/campaigns/${campaignId}`,
		token
	})
}

export async function confirmAndDeleteCampaign({
	campaignId, title, isAdmin = false, token, onSuccess, onError,
	confirmFn = window.confirm
}) {
	const confirmed = confirmFn(
		isAdmin
			? `Opravdu chcete smazat kampaň "${title}"? Tento krok nelze vrátit.`
			: `Opravdu chcete smazat svou kampaň "${title}"? Tento krok nelze vrátit.`
	)

	if (!confirmed) {
		return
	}

	try {
		const result = isAdmin
			? await deleteCampaignAsAdmin({ campaignId, token })
			: await deleteOwnCampaign({ campaignId, token })

		if (onSuccess) {
			onSuccess(result)
		}

		return result
	} catch (error) {
		if (onError) {
			onError(error)
		} else {
			console.error('Delete campaign failed', error)
			alert(error.message || 'Nepodařilo se smazat kampaň.')
		}
		throw error
	}
}
