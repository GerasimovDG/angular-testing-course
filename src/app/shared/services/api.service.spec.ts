import { TestBed } from "@angular/core/testing";
import { ApiService } from "./api.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { TagInterface } from "../types/tag.interface";
import { firstValueFrom } from "rxjs";

describe('ApiService', () => {
    let apiService: ApiService;
    let httpTesting: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        apiService = TestBed.inject(ApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('creates service', () => {
        expect(apiService).toBeTruthy();
    })

    describe('getTags', () => {
        it('should return a list of tags', () => {
            let tags: TagInterface[] = [];
            apiService.getTags().subscribe((res) => {
                tags = res;
            });
            const req = httpTesting.expectOne('https://localhost:3004/tags');
            req.flush([{ id: '1', name: 'foo' }]);
            expect(tags).toEqual([{ id: '1', name: 'foo' }]);
        });

        it('should create a tag (1st approach)', () => {
            let tag: TagInterface | undefined;
            apiService.createTag('Dima').subscribe(res => {
                tag = res;
            });
            const req = httpTesting.expectOne('https://localhost:3004/tags');
            req.flush({ id: '2', name: 'Dima' });
            expect(tag).toEqual({ id: '2', name: 'Dima' });
        });

        it('should create a tag (2nd approach)', async () => {
            const tag$ = apiService.createTag('Dima');
            const tagPromise = firstValueFrom(tag$);

            const req = httpTesting.expectOne('https://localhost:3004/tags');
            expect(req.request.method).toBe('POST');

            req.flush({ id: '2', name: 'Dima' });
            expect(await tagPromise).toEqual({ id: '2', name: 'Dima' });
        });

        it('throws an error if request fails', async () => {
            let actualError: HttpErrorResponse | undefined;
            apiService.createTag('Dima').subscribe({
                next: () => {
                    fail('Sucess should not be called');
                },
                error: (err) => {
                    actualError = err;
                },
            });
            const req = httpTesting.expectOne('https://localhost:3004/tags');
            req.flush('Server error', {
                status: 422,
                statusText: 'Unprocessible entity'
            });

            if (!actualError) {
                throw new Error('Error needs to be defined');
            }

            expect(actualError.status).toEqual(422);
            expect(actualError.statusText).toEqual('Unprocessible entity');
        });
    });
})