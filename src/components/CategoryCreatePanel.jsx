import React, { useState } from 'react'
import PrimaryButton from './buttons/PrimaryButton.jsx'

export default function CategoryCreatePanel({ onCancel, onCreate }) {
	const [name, setName] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		const trimmed = name.trim()
		if (!trimmed) {
			setError('Name is required')
			return
		}

		if (!onCreate) {
			return
		}

		try {
			setLoading(true)
			await onCreate(trimmed)
			setName('')
		} catch (err) {
			setError(err?.message || 'Failed to create category')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex w-full justify-center py-12">
			<div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-lg">
				<h2 className="mb-2 text-2xl font-bold text-gray-900">Add New Category</h2>
				<p className="mb-6 text-sm text-gray-500">Create a category for search and filtering</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1">
						<label className="block text-sm font-semibold text-gray-700">Name</label>

						<input
							type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Technology"
							className="w-full rounded-xl border border-purple-300 px-4 py-2 text-sm
							           focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none"/>

						{error && (
							<p className="text-xs font-medium text-red-500">
								{error}
							</p>
						)}
					</div>

					<div className="mt-6 flex justify-end gap-3">
						<PrimaryButton type="button" variant="light" onClick={onCancel}> Cancel </PrimaryButton>

						<PrimaryButton
							type="submit"
							className="bg-gradient-to-r from-purple-500 to-indigo-500 border-0
							           hover:from-purple-600 hover:to-indigo-600">
							{loading ? 'Adding...' : 'Add'}
						</PrimaryButton>
					</div>
				</form>
			</div>
		</div>
	)
}
