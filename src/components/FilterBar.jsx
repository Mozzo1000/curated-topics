import { useState, useMemo } from "preact/hooks";
import {
	ChevronDown,
	SlidersHorizontal,
	X,
	Search,
	Check,
} from "lucide-preact";

function FilterBar({
	resultCount,
	selectedDomains,
	setSelectedDomains,
	uniqueDomains,
	sortOrder,
	setSortOrder,
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
	const [filterQuery, setFilterQuery] = useState("");

	const domains = uniqueDomains.filter((d) => d !== "all");

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

	const selectClasses = `
    appearance-none pl-4 pr-10 py-2 rounded-xl border border-solid 
    cursor-pointer text-sm transition-all outline-none
    bg-white border-gray-200 text-gray-900 
    dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100
    focus:ring-2 focus:ring-black dark:focus:ring-white
  `;

	return (
		<div className="mb-8">
			{/* Shared Results Counter (Visible on all devices) */}
			<div className="flex items-center justify-between mb-4 sm:mb-0">
				<p className="text-sm font-medium text-gray-500">
					<span className="text-black dark:text-white font-bold">
						{resultCount}
					</span>{" "}
					results
				</p>

				{/* MOBILE FILTER TOGGLE */}
				<button
					onClick={() => setIsMobileMenuOpen(true)}
					className="flex sm:hidden items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
				>
					<SlidersHorizontal size={14} />
					Filters {selectedDomains.length > 0 && `(${selectedDomains.length})`}
				</button>

				{/* DESKTOP CONTROLS */}
				<div className="hidden sm:flex items-center gap-3">
					{/* Searchable Multi-Select Dropdown */}
					<div className="relative w-64">
						<button
							onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
							className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm hover:border-gray-300 dark:hover:border-zinc-700 transition-all"
						>
							<span className="truncate text-gray-700 dark:text-zinc-300">
								{selectedDomains.length === 0
									? "All Domains"
									: `${selectedDomains.length} selected`}
							</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${isDesktopDropdownOpen ? "rotate-180" : ""}`}
							/>
						</button>

						{isDesktopDropdownOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setIsDesktopDropdownOpen(false)}
								/>
								<div className="absolute right-0 mt-2 w-full z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
									<div className="p-2 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
										<Search size={14} className="text-gray-400" />
										<input
											type="text"
											placeholder="Filter domains..."
											value={filterQuery}
											onInput={(e) => setFilterQuery(e.target.value)}
											className="w-full bg-transparent border-none outline-none text-xs p-1 dark:text-white"
											autoFocus
										/>
									</div>

									<div className="max-h-60 overflow-y-auto p-1">
										{searchedDomains.map((domain) => (
											<button
												key={domain}
												onClick={() => toggleDomain(domain)}
												className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
													selectedDomains.includes(domain)
														? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
														: "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
												}`}
											>
												<span className="truncate">{domain}</span>
												{selectedDomains.includes(domain) && (
													<Check size={14} strokeWidth={3} />
												)}
											</button>
										))}
									</div>

									{/* CLEAR SELECTION - DESKTOP */}
									{selectedDomains.length > 0 && (
										<div className="p-2 border-t border-gray-100 dark:border-zinc-800">
											<button
												onClick={() => setSelectedDomains([])}
												className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
							className={selectClasses}
						>
							<option value="desc">Newest First</option>
							<option value="asc">Oldest First</option>
						</select>
						<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
							<ChevronDown size={14} />
						</div>
					</div>
				</div>
			</div>

			{/* MOBILE DRAWER */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col sm:hidden">
					<div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900">
						<h2 className="text-xl font-black">Filters</h2>
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full"
						>
							<X size={20} />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6 space-y-8">
						<div>
							<label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 block">
								Sort Order
							</label>
							<div className="grid grid-cols-2 gap-2">
								{["desc", "asc"].map((order) => (
									<button
										key={order}
										onClick={() => setSortOrder(order)}
										className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
											sortOrder === order
												? "border-black dark:border-white"
												: "border-zinc-100 dark:border-zinc-900 text-zinc-400"
										}`}
									>
										{order === "desc" ? "Newest" : "Oldest"}
									</button>
								))}
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between mb-3">
								<label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block">
									Domains
								</label>
								{selectedDomains.length > 0 && (
									<button
										onClick={() => setSelectedDomains([])}
										className="text-[10px] font-bold uppercase text-red-500"
									>
										Clear All
									</button>
								)}
							</div>
							<div className="relative mb-4">
								<Search
									className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
									size={16}
								/>
								<input
									type="text"
									placeholder="Search domains..."
									onInput={(e) => setFilterQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl outline-none"
								/>
							</div>
							<div className="space-y-2 pb-20">
								{searchedDomains.map((domain) => (
									<button
										key={domain}
										onClick={() => toggleDomain(domain)}
										className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
											selectedDomains.includes(domain)
												? "bg-zinc-100 dark:bg-zinc-800"
												: "bg-zinc-50 dark:bg-zinc-900/40"
										}`}
									>
										<span
											className={
												selectedDomains.includes(domain)
													? "font-bold"
													: "text-zinc-500"
											}
										>
											{domain}
										</span>
										{selectedDomains.includes(domain) && (
											<Check size={16} strokeWidth={3} />
										)}
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 sticky bottom-0">
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
						>
							Show {resultCount} Results
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default FilterBar;
