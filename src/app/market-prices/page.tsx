"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, Search } from "lucide-react"

const cropData = [
  { crop: "Tomato", variety: "Desi", region: "Nashik", price: 2500, change: 5.2 },
  { crop: "Onion", variety: "Red", region: "Pune", price: 1800, change: -2.1 },
  { crop: "Potato", variety: "Jyoti", region: "Agra", price: 1500, change: 3.5 },
  { crop: "Wheat", variety: "Lokwan", region: "Indore", price: 2200, change: 1.8 },
  { crop: "Rice", variety: "Basmati", region: "Karnal", price: 3500, change: 0.5 },
  { crop: "Sugarcane", variety: "Co-86032", region: "Kolhapur", price: 320, change: 1.2 },
  { crop: "Cotton", variety: "BT", region: "Nagpur", price: 6500, change: -0.8 },
  { crop: "Soybean", variety: "JS-335", region: "Ujjain", price: 4500, change: 2.3 },
  { crop: "Tomato", variety: "Hybrid", region: "Bangalore", price: 2800, change: 4.1 },
  { crop: "Onion", variety: "White", region: "Lasalgaon", price: 2100, change: -1.5 },
]

const historicalData: { [key: string]: any[] } = {
  Tomato: [
    { month: "Jan", price: 2200 }, { month: "Feb", price: 2400 }, { month: "Mar", price: 2300 },
    { month: "Apr", price: 2500 }, { month: "May", price: 2700 }, { month: "Jun", price: 2500 },
  ],
  Onion: [
    { month: "Jan", price: 2000 }, { month: "Feb", price: 1900 }, { month: "Mar", price: 2100 },
    { month: "Apr", price: 1800 }, { month: "May", price: 1700 }, { month: "Jun", price: 1800 },
  ],
  Potato: [
    { month: "Jan", price: 1400 }, { month: "Feb", price: 1450 }, { month: "Mar", price: 1500 },
    { month: "Apr", price: 1600 }, { month: "May", price: 1550 }, { month: "Jun", price: 1500 },
  ],
  Wheat: [
     { month: "Jan", price: 2100 }, { month: "Feb", price: 2150 }, { month: "Mar", price: 2200 },
    { month: "Apr", price: 2250 }, { month: "May", price: 2180 }, { month: "Jun", price: 2200 },
  ],
   Rice: [
    { month: "Jan", price: 3400 }, { month: "Feb", price: 3450 }, { month: "Mar", price: 3500 },
    { month: "Apr", price: 3550 }, { month: "May", price: 3520 }, { month: "Jun", price: 3500 },
  ]
}

const chartConfig = {
  price: {
    label: "Price (₹/quintal)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function MarketPricesPage() {
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("Tomato")

  const filteredData = cropData.filter(
    item =>
      (item.crop.toLowerCase().includes(search.toLowerCase()) ||
        item.variety.toLowerCase().includes(search.toLowerCase())) &&
      (region === "all" || item.region === region)
  )

  const regions = ["all", ...Array.from(new Set(cropData.map(c => c.region)))]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Market Prices</h1>
        <p className="text-muted-foreground mt-1">
          Track live and historical crop prices across Indian mandis.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Crop Prices</CardTitle>
                  <CardDescription>
                    Current prices per quintal (unless specified).
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search crop..."
                      className="pl-8"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="w-full flex-1 sm:w-[150px]">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(r => (
                        <SelectItem key={r} value={r}>
                          {r === "all" ? "All Regions" : r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead className="hidden md:table-cell">Variety</TableHead>
                    <TableHead className="hidden sm:table-cell">Region</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map(item => (
                    <TableRow key={`${item.crop}-${item.region}`} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCrop(item.crop)}>
                      <TableCell className="font-medium">{item.crop}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.variety}</TableCell>
                      <TableCell className="hidden sm:table-cell">{item.region}</TableCell>
                      <TableCell className="text-right font-mono">{item.price.toLocaleString("en-IN")}</TableCell>
                      <TableCell
                        className={`text-right font-medium flex justify-end items-center gap-1 ${
                          item.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.change >= 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {item.change}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Historical Prices: {selectedCrop}</CardTitle>
              <CardDescription>6-month price trend for {selectedCrop}.</CardDescription>
            </CardHeader>
            <CardContent>
              {historicalData[selectedCrop] ? (
                 <ChartContainer config={chartConfig} className="h-[250px] w-full">
                 <LineChart
                   data={historicalData[selectedCrop]}
                   margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                 >
                   <CartesianGrid vertical={false} />
                   <XAxis
                     dataKey="month"
                     tickLine={false}
                     axisLine={false}
                     tickMargin={8}
                   />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                   <ChartTooltip
                     cursor={false}
                     content={<ChartTooltipContent />}
                   />
                   <Line
                     dataKey="price"
                     type="monotone"
                     stroke="var(--color-price)"
                     strokeWidth={2}
                     dot={false}
                   />
                 </LineChart>
               </ChartContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                  No historical data available for {selectedCrop}.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
