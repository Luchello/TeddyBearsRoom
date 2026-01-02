# OAuth 설정 가이드 - TeddyBear's Room

> 이 가이드를 따라 Kakao와 Google 로그인을 설정합니다.

---

## 준비물

- Kakao 계정 (개발자 등록)
- Google 계정 (Cloud Console 접근)
- Supabase 대시보드 접근 권한

---

## Step 1: Kakao OAuth 앱 생성

### 1.1 Kakao Developers 접속

1. https://developers.kakao.com 접속
2. 로그인 (카카오 계정)
3. **내 애플리케이션** 클릭

### 1.2 애플리케이션 추가

1. **애플리케이션 추가하기** 클릭
2. 정보 입력:
   - **앱 이름**: TeddyBear's Room
   - **사업자명**: (본인 이름 또는 사업자명)
3. **저장** 클릭

### 1.3 앱 키 확인

앱 생성 후 **앱 키** 탭에서 확인:
- **REST API 키**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

> 이 키를 메모해두세요! Supabase에 입력합니다.

### 1.4 플랫폼 등록

1. **플랫폼** 탭 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 입력:
   - 개발용: `http://localhost:3000`
   - 프로덕션: `https://teddybearsroom.com`
4. **저장** 클릭

### 1.5 Redirect URI 등록 (중요!)

1. **카카오 로그인** > **Redirect URI** 클릭
2. URI 추가:
   ```
   https://bjnjbbdcwkooswvexiuh.supabase.co/auth/v1/callback
   ```
3. **저장** 클릭

### 1.6 동의 항목 설정

1. **카카오 로그인** > **동의항목** 클릭
2. 필수 설정:
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의
   - **카카오계정(이메일)**: 필수 동의

### 1.7 카카오 로그인 활성화

1. **카카오 로그인** 탭
2. **활성화 설정**: ON

---

## Step 2: Google OAuth 앱 생성

### 2.1 Google Cloud Console 접속

1. https://console.cloud.google.com 접속
2. Google 계정으로 로그인

### 2.2 프로젝트 생성

1. 상단 프로젝트 선택 > **새 프로젝트**
2. 정보 입력:
   - **프로젝트 이름**: TeddyBearsRoom
3. **만들기** 클릭

### 2.3 OAuth 동의 화면 설정

1. 좌측 메뉴: **API 및 서비스** > **OAuth 동의 화면**
2. **외부** 선택 > **만들기**
3. 정보 입력:
   - **앱 이름**: TeddyBear's Room
   - **사용자 지원 이메일**: (본인 이메일)
   - **개발자 연락처 정보**: (본인 이메일)
4. **저장 후 계속**

### 2.4 범위(Scope) 설정

1. **범위 추가 또는 삭제** 클릭
2. 다음 범위 선택:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. **저장 후 계속**

### 2.5 테스트 사용자 추가

1. **사용자 추가** 클릭
2. 테스트할 Google 이메일 추가
3. **저장 후 계속**

### 2.6 OAuth 클라이언트 ID 생성

1. 좌측 메뉴: **사용자 인증 정보**
2. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID**
3. 설정:
   - **애플리케이션 유형**: 웹 애플리케이션
   - **이름**: TeddyBear's Room Web
   - **승인된 자바스크립트 원본**:
     - `http://localhost:3000`
     - `https://teddybearsroom.com`
   - **승인된 리디렉션 URI**:
     ```
     https://bjnjbbdcwkooswvexiuh.supabase.co/auth/v1/callback
     ```
4. **만들기** 클릭

### 2.7 클라이언트 ID/Secret 저장

생성 후 표시되는 정보 저장:
- **클라이언트 ID**: `xxxx.apps.googleusercontent.com`
- **클라이언트 보안 비밀번호**: `GOCSPX-xxxx`

---

## Step 3: Supabase 대시보드 설정

### 3.1 Supabase 대시보드 접속

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `bjnjbbdcwkooswvexiuh`

### 3.2 Kakao 프로바이더 활성화

1. 좌측 메뉴: **Authentication** > **Providers**
2. **Kakao** 찾기 > 클릭
3. **Enable Kakao provider** 토글: ON
4. 정보 입력:
   - **Kakao Client ID**: Step 1.3에서 복사한 REST API 키
   - **Kakao Client Secret**: (비워둠 - Kakao는 불필요)
5. **Save** 클릭

### 3.3 Google 프로바이더 활성화

1. **Google** 찾기 > 클릭
2. **Enable Google provider** 토글: ON
3. 정보 입력:
   - **Google Client ID**: Step 2.7에서 복사한 클라이언트 ID
   - **Google Client Secret**: Step 2.7에서 복사한 보안 비밀번호
4. **Save** 클릭

### 3.4 Redirect URLs 확인

1. 좌측 메뉴: **Authentication** > **URL Configuration**
2. **Redirect URLs**에 추가:
   - `http://localhost:3000/api/auth/callback`
   - `https://teddybearsroom.com/api/auth/callback`
3. **Save** 클릭

---

## Step 4: 테스트

### 4.1 개발 서버 재시작

```bash
cd web
npm run dev
```

### 4.2 로그인 테스트

1. http://localhost:3000/login 접속
2. **카카오로 계속하기** 클릭
3. 카카오 로그인 화면으로 이동 확인
4. 로그인 완료 후 홈페이지로 리다이렉트 확인

### 4.3 Google 테스트

1. http://localhost:3000/login 접속
2. **Google로 계속하기** 클릭
3. Google 계정 선택 화면 확인
4. 로그인 완료 후 홈페이지로 리다이렉트 확인

---

## 문제 해결

### 503 에러
- Supabase에서 프로바이더가 활성화되지 않음
- Client ID/Secret이 입력되지 않음

### "redirect_uri_mismatch" 에러
- Kakao/Google에 등록된 Redirect URI가 정확하지 않음
- Supabase 콜백 URL 확인: `https://bjnjbbdcwkooswvexiuh.supabase.co/auth/v1/callback`

### "access_denied" 에러
- Kakao 로그인이 활성화되지 않음
- 동의 항목에서 이메일이 필수로 설정되지 않음

---

## 체크리스트

- [ ] Kakao Developers 앱 생성
- [ ] Kakao REST API 키 복사
- [ ] Kakao Redirect URI 등록
- [ ] Kakao 로그인 활성화
- [ ] Google Cloud 프로젝트 생성
- [ ] Google OAuth 동의 화면 설정
- [ ] Google OAuth 클라이언트 ID 생성
- [ ] Google Redirect URI 등록
- [ ] Supabase Kakao 프로바이더 활성화
- [ ] Supabase Google 프로바이더 활성화
- [ ] Supabase Redirect URLs 등록
- [ ] 로그인 테스트 완료
