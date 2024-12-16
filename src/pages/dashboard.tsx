import Button from "@/components/Button";
import LayoutDashboard from "@/components/LayoutDashboard";
import SidebarApp from "@/components/SidebarApp";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "@/hoc/AuthPage";
import {
  ChartData,
  CountIncomeOutcome,
  CountProductByCategory,
  DetailTransaction,
  initChartData,
  initCountIncomeOutcome,
} from "@/interface/response/Dashboard";
import { getDashboardData } from "@/services/dashboard";
import formatRupiah from "@/utils/format/formatRupiah";
import { useEffect, useState } from "react";
import {
  MdInsertChartOutlined,
  MdOutlinePieChart,
  MdOutlineRefresh,
  MdOutlineStackedBarChart,
  MdSsidChart,
} from "react-icons/md";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import LoadingCorner from "@/components/LoadingCorner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const DashboardPage = () => {
  // BENTO 1 2
  const [annuallyInOut, setAnnuallyInOut] = useState<CountIncomeOutcome>(
    initCountIncomeOutcome
  );
  const [monthlyInOut, setMonthlyInOut] = useState<CountIncomeOutcome>(
    initCountIncomeOutcome
  );

  // BENTO 3 4
  const [summaryIncomeByCategory, setSummaryIncomeByCategory] = useState<
    DetailTransaction[]
  >([]);
  const [summaryOutcomeByCategory, setSummaryOutcomeByCategory] = useState<
    DetailTransaction[]
  >([]);

  // BENTO 5
  const [countProductByCategory, setCountProductByCategory] = useState<
    CountProductByCategory[]
  >([]);

  // BENTO 6
  const [chartData, setChartData] = useState<ChartData>(initChartData);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      if (res) {
        setAnnuallyInOut(res.data.count.annually);
        setMonthlyInOut(res.data.count.monthly);
        setSummaryIncomeByCategory(res.data.groupByCategory.inTransaction);
        setSummaryOutcomeByCategory(res.data.groupByCategory.outTransaction);
        setCountProductByCategory(res.data.countProductByCategory);
        setChartData(res.data.chart);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createChartData = (
    data: DetailTransaction[],
    type: "income" | "outcome"
  ) => {
    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: type === "income" ? "Pemasukan" : "Pengeluaran",
          data: data.map((item) => item.totalTransaction),
          backgroundColor:
            type === "income"
              ? "rgba(75, 192, 192, 0.2)"
              : "rgba(255, 99, 132, 0.2)",
          borderColor:
            type === "income"
              ? "rgba(75, 192, 192, 1)"
              : "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const createPieChartData = (data: CountProductByCategory[]) => {
    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          data: data.map((item) => item._count.products),
          backgroundColor: data.map(
            (_, index) => `hsl(${(index * 360) / data.length}, 70%, 60%)`
          ),
          hoverOffset: 4,
        },
      ],
    };
  };

  const createLineChartData = (data: ChartData) => {
    return {
      labels: data.inTransaction.map((item) => item.monthName),
      datasets: [
        {
          label: "Pemasukan",
          data: data.inTransaction.map((item) => item.total),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
        {
          label: "Pengeluaran",
          data: data.outTransaction.map((item) => item.total),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <SidebarApp>
      <LayoutDashboard
        title="Dashboard"
        childrenHeader={
          <Button
            onClick={fetchData}
            className="bg-black outline-none border-none"
          >
            <MdOutlineRefresh />
          </Button>
        }
      >
        <BentoGrid className="w-full mx-auto md:auto-rows-[20rem]">
          <BentoGridItem
            title="Ringkasan Tahunan"
            description="Pemasukan dan Pengeluaran Tahunan"
            header={
              <div className="w-full">
                <h1 className="text-xl font-bold">Pemasukan</h1>
                <p className="text-green-600">
                  + {formatRupiah(annuallyInOut.income)}
                </p>
                <div className="w-full h-[1px] bg-neutral-200 my-2" />
                <h1 className="text-xl font-bold">Pengeluaran</h1>
                <p className="text-red-600">
                  - {formatRupiah(annuallyInOut.outcome)}
                </p>
                <button className="bg-gradient-to-br relative group/btn from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] text-center flex items-center justify-center mt-4">
                  Unduh Laporan
                </button>
              </div>
            }
            icon={<MdInsertChartOutlined />}
          />

          <BentoGridItem
            title="Ringkasan Bulanan"
            description="Pemasukan dan Pengeluaran Bulanan"
            header={
              <div className="w-full">
                <h1 className="text-xl font-bold">Pemasukan</h1>
                <p className="text-green-600">
                  + {formatRupiah(monthlyInOut.income)}
                </p>
                <div className="w-full h-[1px] bg-neutral-200 my-2" />
                <h1 className="text-xl font-bold">Pengeluaran</h1>
                <p className="text-red-600">
                  - {formatRupiah(monthlyInOut.outcome)}
                </p>
                <button className="bg-gradient-to-br relative group/btn from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] text-center flex items-center justify-center mt-4">
                  Unduh Laporan
                </button>
              </div>
            }
            icon={<MdInsertChartOutlined />}
          />

          <BentoGridItem
            title="Produk"
            description="Total Produk berdasarkan kategori"
            header={
              <div className="w-full h-full flex items-center justify-center">
                <Pie
                  data={createPieChartData(countProductByCategory)}
                  style={{
                    maxHeight: "100%",
                  }}
                />
              </div>
            }
            icon={<MdOutlinePieChart />}
          />
          <BentoGridItem
            title="Pemasukan dan Pengeluaran"
            description="Visualisasi pemasukan pengeluaran dalam satu tahun"
            className="col-span-2"
            header={
              <div className="w-full h-full flex items-center justify-center overflow-auto">
                <Line
                  data={createLineChartData(chartData)}
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                  }}
                />
              </div>
            }
            icon={<MdSsidChart />}
          />

          <BentoGridItem
            title="Ringkasan Pemasukan (Kategori)"
            description="Visualisasi total pemasukan berdasarkan kategori"
            header={
              <div className="w-full h-full flex items-center justify-center">
                <Bar
                  data={createChartData(summaryIncomeByCategory, "income")}
                  style={{
                    maxHeight: "100%",
                  }}
                />
              </div>
            }
            icon={<MdOutlineStackedBarChart />}
          />

          <BentoGridItem
            title="Ringkasan Pengeluaran (Kategori)"
            description="Visualisasi total pengeluaran berdasarkan kategori"
            header={
              <div className="w-full h-full flex items-center justify-center">
                <Bar
                  data={createChartData(summaryOutcomeByCategory, "outcome")}
                  style={{
                    maxHeight: "100%",
                  }}
                />
              </div>
            }
            icon={<MdOutlineStackedBarChart />}
          />
        </BentoGrid>
        <LoadingCorner visible={loading} />
      </LayoutDashboard>
      <Toaster />
    </SidebarApp>
  );
};

export default AuthPage(DashboardPage, ["SUPER_ADMIN", "ADMIN"]);
