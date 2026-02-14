import { useState, useMemo } from "preact/hooks";
import { ChevronDown, Search, Check, X } from "lucide-preact";

function FilterBar({
	resultCount,
	selectedDomains,
	setSelectedDomains,
	uniqueDomains,
	sortOrder,
	setSortOrder,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [filterQuery, setFilterQuery] = useState("");

	const domains = uniqueDomains.filter((d) => d !== "all");

	// Filter the dropdown list based on the search input
	const searchedDomains = useMemo(() => {
		return domains.filter((d) =>
			d.toLowerCase().includes(filterQuery.toLowerCase()),
		);
	}, [domains, filterQuery]);

	const toggleDomain = (domain) => {
		setSelectedDomains((prev) =>
			prev.includes(domain)
				? prev.filter((d) => d !== domain)
				: [...prev, domain],
		);
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<p className="text-sm font-medium text-gray-500">
				<span className="text-black dark:text-white font-bold">
					{resultCount}
				</span>{" "}
				results
			</p>

			<div className="flex items-center gap-3">
				<div className="relative w-64">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm transition-all hover:border-gray-300 dark:hover:border-zinc-700"
					>
						<span className="truncate text-gray-700 dark:text-zinc-300">
							{selectedDomains.length === 0
								? "All Domains"
								: `${selectedDomains.length} selected`}
						</span>
						<ChevronDown
							size={16}
							className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{isOpen && (
						<>
							{/* Overlay to close dropdown */}
							<div
								className="fixed inset-0 z-40"
								onClick={() => setIsOpen(false)}
							/>

							<div className="absolute right-0 mt-2 w-full z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
								{/* Search Input inside Dropdown */}
								<div className="p-2 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
									<Search size={14} className="text-gray-400" />
									<input
										type="text"
										placeholder="Search domains..."
										value={filterQuery}
										onInput={(e) => setFilterQuery(e.target.value)}
										className="w-full bg-transparent border-none outline-none text-xs p-1 dark:text-white"
										autoFocus
									/>
									{filterQuery && (
										<button onClick={() => setFilterQuery("")}>
											<X
												size={14}
												className="text-gray-400 hover:text-gray-600"
											/>
										</button>
									)}
								</div>

								{/* Options List */}
								<div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
									{searchedDomains.length > 0 ? (
										searchedDomains.map((domain) => {
											const isSelected = selectedDomains.includes(domain);
											return (
												<button
													key={domain}
													onClick={() => toggleDomain(domain)}
													className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
														isSelected
															? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
															: "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-zinc-400"
													}`}
												>
													<span className="truncate">{domain}</span>
													{isSelected && (
														<Check
															size={14}
															strokeWidth={3}
															className="text-black dark:text-white"
														/>
													)}
												</button>
											);
										})
									) : (
										<div className="p-4 text-center text-xs text-gray-400">
											No domains found
										</div>
									)}
								</div>

								{/* Footer/Actions */}
								{selectedDomains.length > 0 && (
									<div className="p-2 border-t border-gray-100 dark:border-zinc-800">
										<button
											onClick={() => setSelectedDomains([])}
											className="w-full py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
										>
											Clear Selection
										</button>
									</div>
								)}
							</div>
						</>
					)}
				</div>
				<div className="relative">
					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
						className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-solid 
    cursor-pointer text-sm transition-all outline-none
    bg-white border-gray-200 text-gray-900 
    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100
    focus:ring-2 focus:ring-black dark:focus:ring-white">
						<option value="desc">Newest First</option>
						<option value="asc">Oldest First</option>
					</select>
					<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
						<ChevronDown size={14} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default FilterBar;
