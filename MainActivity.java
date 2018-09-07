package com.kosmo.ledcontrollapp;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.AsyncTask;
import android.os.SystemClock;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    public static Context APP_CONTEXT;
    private RequestQueue queue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //타이틀바 색상 변경-자바코드
        getSupportActionBar().setBackgroundDrawable(new ColorDrawable(0x99FF0000));
        //위젯 얻고 리스너 부착]
        findViewById(R.id.btnOn).setOnClickListener(this);
        findViewById(R.id.btnOff).setOnClickListener(this);
        findViewById(R.id.btnToggle).setOnClickListener(this);
        //원격 이미지를 로드하기위한
        //VolleySingleton클래스를 사용하기 위한 코드(원격 이미지 미 로드시 필요없음)
        APP_CONTEXT=getApplicationContext();
       ;
    }

    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.btnOn) {
            new LedActionAsyncTask().execute(
                    "http://192.168.0.7:8080/ledcontrol/on"
            );
        }/////////////////////////////
        else if (view.getId() == R.id.btnOff) {
            new LedActionAsyncTask().execute(
                    "http://192.168.0.7:8080/ledcontrol/off"
            );
        }
        else {

            new LedActionAsyncTask().execute(
                    "http://192.168.0.7:8080/ledcontrol/toggle"
            );

        }

    }////////////////////////////
    private class LedActionAsyncTask extends AsyncTask<String,Void,String> {

        @Override
        protected String doInBackground(String... params) {
            StringBuffer buffer = new StringBuffer();
            try {

                URL url = new URL(params[0]);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                //연결설정
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(3000);


                //서버에 요청 및 응답코드 받기
                int responseCode=conn.getResponseCode();

                if(responseCode == HttpURLConnection.HTTP_OK){//응답 받기 성공
                    //연결된 커넥션에서 서버에서 보낸 데이타 읽기

                    BufferedReader reader = new BufferedReader(
                            new InputStreamReader(conn.getInputStream())
                    );
                    String data;
                    while((data=reader.readLine())!=null){
                        buffer.append(data);
                    }

                    reader.close();

                }
            } catch (Exception e) { e.printStackTrace(); }
            return buffer.toString();
        }
        @Override
        protected void onPostExecute(String result) {

            try {

                Toast.makeText(MainActivity.this, "서버로부터 받은 데이타:"+result, Toast.LENGTH_SHORT).show();


            }
            catch(Exception e){e.printStackTrace();}

        }
    }/////////////////////////////
}

