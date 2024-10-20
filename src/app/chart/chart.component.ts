import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CourrierService } from '../services/courrier/courrier.service';
import { TexteService } from '../services/courrier/texte.service';
import { ActiviteService } from '../services/courrier/activite.service';
import { LivretService } from '../services/courrier/livret.service';
import { PtaService } from '../services/courrier/pta.service';
import { TableauDeBordService } from '../services/courrier/tableauDeBord.service';
import { AutreDocumentService } from '../services/courrier/autreDocument.service';
// Import ApexCharts dynamically in the browser environment
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FlowbiteService } from '../services/flowbite.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  private chart: any;
  private ApexCharts: any; // Declare ApexCharts variable to be loaded conditionally

  constructor(
    private courrierService: CourrierService,
    private texteService: TexteService,
    private activiteService: ActiviteService,
    private livretService: LivretService,
    private ptaService: PtaService,
    private tableauDeBordService: TableauDeBordService,
    private autreDocumentService: AutreDocumentService,
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID to detect environment
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Load ApexCharts only in the browser
      this.loadApexChartsLibrary().then(() => {
        this.loadChartData();
        this.flowbiteService.loadFlowbite(flowbite => {
          console.log('Flowbite loaded:', flowbite);
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private async loadApexChartsLibrary(): Promise<void> {
    // Dynamically import ApexCharts in the browser environment
    const module = await import('apexcharts');
    this.ApexCharts = module.default;
  }

  loadChartData(): void {
    forkJoin({
      activites: this.activiteService.getAllActivites(),
      autreDocuments: this.autreDocumentService.getAllAutreDocuments(),
      livrets: this.livretService.getAllLivrets(),
      ptas: this.ptaService.getAllPtas(),
      tableauDeBords: this.tableauDeBordService.getAllTableauDeBords(),
      textes: this.texteService.getAllTextes()
    }).subscribe({
      next: (results) => {
        const activiteCount = results.activites.length;
        const autreDocumentCount = results.autreDocuments.length;
        const livretCount = results.livrets.length;
        const ptaCount = results.ptas.length;
        const tableauDeBordCount = results.tableauDeBords.length;
        const texteCount = results.textes.length;

        const totalCount = activiteCount + autreDocumentCount + livretCount + ptaCount + tableauDeBordCount + texteCount;

        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
          totalCountElement.textContent = totalCount.toString();
        }

        if (this.chart) {
          this.chart.destroy();
        }

        const options = {
          series: [activiteCount, autreDocumentCount, livretCount, ptaCount, tableauDeBordCount, texteCount],
          chart: {
            type: 'donut',
            height: 320
          },
          labels: ['Activités', 'Autre Documents', 'Livrets', 'PTAs', 'Tableau de Bord', 'Textes'],
          colors: ['#d97706', '#fef08a', '#9CA3AF', '#d4d4d8', '#0c4a6e', '#1d4ed8'],
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                    formatter: () => totalCount.toString()
                  }
                }
              }
            }
          },
          legend: {
            position: 'bottom'
          }
        };

        this.chart = new this.ApexCharts(document.querySelector('#donut-chart'), options);
        this.chart.render();
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
}