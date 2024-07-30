# 24.07.30

### KPT

- Keep
    - AI 모델 테스트 (Blazepose)
    - Blazepose 코드 학습하기
    - 일치율 계산 하기

- Problem
    - 일치율 계산 시 정규화를 하면 너무 일치율이 높아짐
    - JSON파일로 keypoint를 다 저장한 뒤 canvas에 그려주려 했으나 음악과의 싱크 문제가 발생함

- Try
    - JSON파일이 아닌 실시간으로 영상과 내 캠을 인식하는 형태로 우선 진행하기
    - JSON파일로 하게 된다면 사용자의 GPU에 부담을 덜어줄 수 있음
    - 인프라 구축 학습하기
    - jenkins 학습하기

### react blazepose

- npm install
    - npm install @mediapipe/pose
    - npm install @mediapipe/drawing_utils
    - npm install three
    - npm install @react-three/fiber
    - npm install @react-three/drei
    - npm install @tensorflow/tfjs
    - npm install @tensorflow-models/pose-detection

- 진행 중

- Chrome에서의 GPU 설정 
    - 설정 > 고급 > 시스템 > "가능한 경우 하드웨어 가속 사용" 옵션 활성화
    - chrome://flags
    - chrome://gpu

- 문제점
    - 클라이언트의 GPU를 사용해야함
    - 크롬에서의 하드웨어 가속
    - 테스트 중 내장그래픽 GPU가 계속 사용됨
    - JSON 형태로 사용자의 GPU 부담을 줄여주려 했으나 싱크 문제 발생
    - 일치율에서 정규화를 한다면 너무 높은 일치율이 나와서 연산 방법을 달리해야할 필요가 있음

