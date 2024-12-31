import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <h1>Page Not Found</h1>
      <p>We couldn't find the page you're looking for.</p>
      <a routerLink="/" class="back-home">Back to Home</a>
    </section>
  `,
  styles: [
    `
      .not-found {
        text-align: center;
        padding: 4rem 1rem;
      }

      h1 {
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 2rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .back-home {
        display: inline-block;
        padding: 1rem 2rem;
        background-color: #df704a;
        color: white;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1px;

        &:hover {
          background-color: #f8af85;
        }
      }
    `,
  ],
})
export class NotFoundComponent {}
